import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessagesModal from "../components/MessagesModal";
import { useBackend } from "../hooks/useBackend";

export default function MessagesPage() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const backend = useBackend();

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => backend.messages.listConversations({}),
  });

  const filteredConversations = conversationsData?.conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Send size={28} className="mr-3 text-purple-400" />
            Messages
          </h1>
          <Button
            onClick={() => setShowMessagesModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Edit size={16} className="mr-2" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
          />
        </div>

        {/* Conversations List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    <div className="h-3 w-32 bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-3 w-12 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Send size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-lg">No conversations yet</p>
              <p className="text-sm mb-6">Start a conversation with someone!</p>
              <Button
                onClick={() => setShowMessagesModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
              >
                Start Messaging
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => setShowMessagesModal(true)}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <img
                      src={conversation.userImageUrl || `https://i.pravatar.cc/100?u=${conversation.userId}`}
                      alt={conversation.username}
                      className="h-12 w-12 rounded-full ring-2 ring-purple-500/30"
                    />
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white truncate">{conversation.username}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {new Date(conversation.lastMessageAt).toLocaleDateString()}
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
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MessagesModal
        open={showMessagesModal}
        onOpenChange={setShowMessagesModal}
      />
    </>
  );
}
