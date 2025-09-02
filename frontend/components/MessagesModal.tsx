import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Send, ArrowLeft, Image, Video, Mic, Reply, MoreVertical, Phone, VideoIcon } from "lucide-react";
import { useBackend } from "../hooks/useBackend";
import { useUser } from "@clerk/clerk-react";

interface MessagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId?: string;
}

interface Message {
  id: number;
  senderId: string;
  senderUsername: string;
  senderImageUrl?: string;
  recipientId: string;
  content: string;
  messageType: "text" | "image" | "video" | "audio";
  mediaUrl?: string;
  replyToId?: number;
  replyToContent?: string;
  isRead: boolean;
  createdAt: Date;
}

interface Conversation {
  userId: string;
  username: string;
  userImageUrl?: string;
  lastMessage: string;
  lastMessageType: "text" | "image" | "video" | "audio";
  lastMessageAt: Date;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesModal({ open, onOpenChange, selectedUserId }: MessagesModalProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(selectedUserId || null);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [liveStream, setLiveStream] = useState<any>(null);
  const [typingStream, setTypingStream] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { user } = useUser();
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => backend.messages.listConversations({}),
    enabled: open,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", currentUserId],
    queryFn: () => backend.messages.listMessages({ userId: currentUserId! }),
    enabled: !!currentUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { recipientId: string; content: string; messageType: "text" | "image" | "video" | "audio"; mediaUrl?: string; replyToId?: number }) =>
      backend.messages.sendMessage(data),
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ["messages", currentUserId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setNewMessage("");
      setReplyingTo(null);
      
      // Send via live stream if connected
      if (liveStream && currentUserId) {
        const conversationId = [user?.id, currentUserId].sort().join(':');
        liveStream.send({
          ...newMessage,
          conversationId,
        });
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (userId: string) => backend.messages.markMessagesRead({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Initialize live streams when modal opens
  useEffect(() => {
    if (open) {
      // Initialize live messages stream
      backend.messages.liveMessages().then(stream => {
        setLiveStream(stream);
        
        // Listen for incoming messages
        (async () => {
          try {
            for await (const message of stream) {
              queryClient.setQueryData(["messages", message.senderId], (oldData: any) => {
                if (!oldData) return { messages: [message] };
                return {
                  ...oldData,
                  messages: [...oldData.messages, message]
                };
              });
              queryClient.invalidateQueries({ queryKey: ["conversations"] });
              
              // Show toast for new messages
              if (message.senderId !== user?.id) {
                toast({
                  title: `New message from ${message.senderUsername}`,
                  description: message.messageType === "text" ? message.content : `Sent a ${message.messageType}`,
                });
              }
            }
          } catch (error) {
            console.error("Live messages stream error:", error);
          }
        })();
      });

      // Initialize typing indicators stream
      backend.messages.typingIndicators().then(stream => {
        setTypingStream(stream);
        
        // Listen for typing indicators
        (async () => {
          try {
            for await (const indicator of stream) {
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                if (indicator.isTyping) {
                  newSet.add(indicator.userId);
                } else {
                  newSet.delete(indicator.userId);
                }
                return newSet;
              });
              
              // Auto-remove typing indicator after 3 seconds
              setTimeout(() => {
                setTypingUsers(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(indicator.userId);
                  return newSet;
                });
              }, 3000);
            }
          } catch (error) {
            console.error("Typing indicators stream error:", error);
          }
        })();
      });
    }

    return () => {
      if (liveStream) {
        liveStream.close?.();
      }
      if (typingStream) {
        typingStream.close?.();
      }
    };
  }, [open]);

  // Set selected user when modal opens
  useEffect(() => {
    if (selectedUserId) {
      setCurrentUserId(selectedUserId);
    }
  }, [selectedUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (currentUserId) {
      markReadMutation.mutate(currentUserId);
    }
  }, [currentUserId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    sendMessageMutation.mutate({
      recipientId: currentUserId,
      content: newMessage.trim(),
      messageType: "text",
      replyToId: replyingTo?.id,
    });
  };

  const handleTyping = () => {
    if (!isTyping && typingStream && currentUserId) {
      setIsTyping(true);
      typingStream.send({
        userId: currentUserId,
        username: user?.username || "User",
        isTyping: true,
        timestamp: new Date(),
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && typingStream && currentUserId) {
        setIsTyping(false);
        typingStream.send({
          userId: currentUserId,
          username: user?.username || "User",
          isTyping: false,
          timestamp: new Date(),
        });
      }
    }, 2000);
  };

  const currentConversation = conversationsData?.conversations.find(c => c.userId === currentUserId);
  const isCurrentUserTyping = currentUserId ? typingUsers.has(currentUserId) : false;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatTime(messageDate);
    } else if (diffInHours < 24 * 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessagePreview = (message: string, type: string) => {
    if (type !== "text") {
      return `📎 ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    return message.length > 40 ? message.substring(0, 40) + "..." : message;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh] bg-gray-800 border-gray-700 text-white p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`${currentUserId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-gray-700`}>
            <DialogHeader className="p-4 border-b border-gray-700">
              <DialogTitle className="text-white flex items-center">
                <Send size={20} className="mr-2 text-purple-400" />
                Messages
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1">
              {conversationsLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                      <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-gray-700 rounded"></div>
                        <div className="h-3 w-32 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversationsData?.conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Send size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-lg">No conversations yet</p>
                  <p className="text-sm">Start a conversation with someone!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {conversationsData?.conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => setCurrentUserId(conversation.userId)}
                      className={`flex items-center space-x-3 p-4 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                        currentUserId === conversation.userId ? "bg-purple-500/20" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-1 ring-purple-500/30">
                          <AvatarImage src={conversation.userImageUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {conversation.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white truncate">{conversation.username}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              {formatLastMessageTime(conversation.lastMessageAt)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {getMessagePreview(conversation.lastMessage, conversation.lastMessageType)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {currentUserId ? (
            <div className="flex flex-col flex-1">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentUserId(null)}
                    className="md:hidden text-gray-400 hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <Avatar className="h-10 w-10 ring-1 ring-purple-500/30">
                    <AvatarImage src={currentConversation?.userImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {currentConversation?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{currentConversation?.username}</p>
                    {isCurrentUserTyping && (
                      <p className="text-xs text-purple-400">typing...</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Phone size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <VideoIcon size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical size={20} />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-2xl animate-pulse ${
                          i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'
                        }`}>
                          <div className="h-4 w-32 bg-gray-500 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messagesData?.messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      return (
                        <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                            {message.replyToId && message.replyToContent && (
                              <div className="bg-gray-700/50 border-l-2 border-purple-500 p-2 mb-2 rounded text-xs text-gray-400">
                                <Reply size={12} className="inline mr-1" />
                                {message.replyToContent.length > 50 
                                  ? message.replyToContent.substring(0, 50) + "..."
                                  : message.replyToContent
                                }
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-2xl group relative ${
                                isOwn
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-gray-700 text-white'
                              }`}
                            >
                              {message.messageType === "text" ? (
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              ) : (
                                <div>
                                  {message.messageType === "image" && (
                                    <img
                                      src={message.mediaUrl}
                                      alt="Shared image"
                                      className="max-w-full rounded-lg mb-2"
                                    />
                                  )}
                                  {message.messageType === "video" && (
                                    <video
                                      src={message.mediaUrl}
                                      controls
                                      className="max-w-full rounded-lg mb-2"
                                    />
                                  )}
                                  {message.content && (
                                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs opacity-70">
                                  {formatTime(message.createdAt)}
                                </span>
                                {isOwn && (
                                  <span className="text-xs opacity-70">
                                    {message.isRead ? "Read" : "Sent"}
                                  </span>
                                )}
                              </div>
                              
                              {/* Reply button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(message)}
                                className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-gray-300 hover:text-white"
                              >
                                <Reply size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Reply Banner */}
              {replyingTo && (
                <div className="flex items-center justify-between bg-gray-700/50 border-t border-gray-600 p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Reply size={16} className="text-purple-400" />
                    <span>Replying to:</span>
                    <span className="font-medium">{replyingTo.content.substring(0, 30)}...</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <Image size={20} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <Video size={20} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <Mic size={20} />
                    </Button>
                  </div>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <Send size={20} />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
              <div className="text-center">
                <Send size={64} className="mx-auto mb-4 text-gray-500" />
                <p className="text-xl">Select a conversation</p>
                <p className="text-sm">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
