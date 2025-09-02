import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { messagesDB } from "./db";

export interface ListConversationsParams {
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface Conversation {
  userId: string;
  username: string;
  userImageUrl?: string;
  lastMessage: string;
  lastMessageType: "text" | "image" | "video" | "audio";
  lastMessageAt: Date;
  unreadCount: number;
  isOnline: boolean;
}

export interface ListConversationsResponse {
  conversations: Conversation[];
}

// Lists all conversations for the current user.
export const listConversations = api<ListConversationsParams, ListConversationsResponse>(
  { auth: true, expose: true, method: "GET", path: "/messages/conversations" },
  async (params) => {
    const auth = getAuthData()!;
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    const conversations: Conversation[] = [];
    for await (const conv of messagesDB.query<Conversation>`
      WITH conversation_partners AS (
        SELECT DISTINCT 
          CASE 
            WHEN sender_id = ${auth.userID} THEN recipient_id 
            ELSE sender_id 
          END as user_id
        FROM messages 
        WHERE sender_id = ${auth.userID} OR recipient_id = ${auth.userID}
      ),
      latest_messages AS (
        SELECT 
          cp.user_id,
          m.content as "lastMessage",
          m.message_type as "lastMessageType", 
          m.created_at as "lastMessageAt",
          ROW_NUMBER() OVER (PARTITION BY cp.user_id ORDER BY m.created_at DESC) as rn
        FROM conversation_partners cp
        JOIN messages m ON (
          (m.sender_id = cp.user_id AND m.recipient_id = ${auth.userID}) OR
          (m.sender_id = ${auth.userID} AND m.recipient_id = cp.user_id)
        )
      ),
      unread_counts AS (
        SELECT 
          sender_id as user_id,
          COUNT(*) as unread_count
        FROM messages 
        WHERE recipient_id = ${auth.userID} AND is_read = false
        GROUP BY sender_id
      )
      SELECT 
        lm.user_id as "userId",
        u.username,
        u.image_url as "userImageUrl",
        lm."lastMessage",
        lm."lastMessageType",
        lm."lastMessageAt",
        COALESCE(uc.unread_count, 0) as "unreadCount",
        false as "isOnline"
      FROM latest_messages lm
      JOIN users u ON lm.user_id = u.id
      LEFT JOIN unread_counts uc ON lm.user_id = uc.user_id
      WHERE lm.rn = 1
      ORDER BY lm."lastMessageAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `) {
      conversations.push(conv);
    }

    return { conversations };
  }
);
