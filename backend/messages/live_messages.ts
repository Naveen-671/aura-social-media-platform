import { api, StreamInOut } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface LiveMessage {
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
  conversationId: string;
}

const activeLiveStreams: Map<string, Set<StreamInOut<LiveMessage, LiveMessage>>> = new Map();

// Real-time message streaming for conversations.
export const liveMessages = api.streamInOut<LiveMessage, LiveMessage>(
  { auth: true, expose: true, path: "/messages/live" },
  async (stream) => {
    const auth = getAuthData()!;
    let currentConversationId: string | null = null;

    try {
      for await (const messageData of stream) {
        const conversationId = messageData.conversationId;
        
        // Remove from previous conversation if switching
        if (currentConversationId && currentConversationId !== conversationId) {
          const prevStreams = activeLiveStreams.get(currentConversationId);
          if (prevStreams) {
            prevStreams.delete(stream);
          }
        }

        currentConversationId = conversationId;
        
        // Add to current conversation
        if (!activeLiveStreams.has(conversationId)) {
          activeLiveStreams.set(conversationId, new Set());
        }
        activeLiveStreams.get(conversationId)!.add(stream);

        // Broadcast message to other participants in the conversation
        const streams = activeLiveStreams.get(conversationId);
        if (streams) {
          for (const otherStream of streams) {
            if (otherStream !== stream) {
              try {
                await otherStream.send(messageData);
              } catch (err) {
                streams.delete(otherStream);
              }
            }
          }
        }
      }
    } finally {
      // Cleanup when stream ends
      if (currentConversationId) {
        const streams = activeLiveStreams.get(currentConversationId);
        if (streams) {
          streams.delete(stream);
          if (streams.size === 0) {
            activeLiveStreams.delete(currentConversationId);
          }
        }
      }
    }
  }
);
