import { api, StreamInOut } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface TypingIndicator {
  userId: string;
  username: string;
  isTyping: boolean;
  timestamp: Date;
}

const activeTypingStreams: Map<string, Set<StreamInOut<TypingIndicator, TypingIndicator>>> = new Map();

// Real-time typing indicators for conversations.
export const typingIndicators = api.streamInOut<TypingIndicator, TypingIndicator>(
  { auth: true, expose: true, path: "/messages/typing" },
  async (stream) => {
    const auth = getAuthData()!;
    let currentConversationId: string | null = null;

    try {
      for await (const typingData of stream) {
        const conversationId = [auth.userID, typingData.userId].sort().join(':');
        
        // Remove from previous conversation if switching
        if (currentConversationId && currentConversationId !== conversationId) {
          const prevStreams = activeTypingStreams.get(currentConversationId);
          if (prevStreams) {
            prevStreams.delete(stream);
          }
        }

        currentConversationId = conversationId;
        
        // Add to current conversation
        if (!activeTypingStreams.has(conversationId)) {
          activeTypingStreams.set(conversationId, new Set());
        }
        activeTypingStreams.get(conversationId)!.add(stream);

        // Broadcast typing indicator to other participants
        const streams = activeTypingStreams.get(conversationId);
        if (streams) {
          for (const otherStream of streams) {
            if (otherStream !== stream) {
              try {
                await otherStream.send({
                  userId: auth.userID,
                  username: auth.email || "User", // Fallback username
                  isTyping: typingData.isTyping,
                  timestamp: new Date(),
                });
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
        const streams = activeTypingStreams.get(currentConversationId);
        if (streams) {
          streams.delete(stream);
          if (streams.size === 0) {
            activeTypingStreams.delete(currentConversationId);
          }
        }
      }
    }
  }
);
