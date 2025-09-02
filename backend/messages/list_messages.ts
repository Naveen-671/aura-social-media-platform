import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { messagesDB } from "./db";

export interface ListMessagesParams {
  userId: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface Message {
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
  updatedAt: Date;
}

export interface ListMessagesResponse {
  messages: Message[];
}

// Lists messages in a conversation with another user.
export const listMessages = api<ListMessagesParams, ListMessagesResponse>(
  { auth: true, expose: true, method: "GET", path: "/messages" },
  async (params) => {
    const auth = getAuthData()!;
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    const messages: Message[] = [];
    for await (const message of messagesDB.query<Message>`
      SELECT m.id, m.sender_id as "senderId", u.username as "senderUsername", u.image_url as "senderImageUrl",
             m.recipient_id as "recipientId", m.content, m.message_type as "messageType", 
             m.media_url as "mediaUrl", m.reply_to_id as "replyToId",
             reply.content as "replyToContent", m.is_read as "isRead",
             m.created_at as "createdAt", m.updated_at as "updatedAt"
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      LEFT JOIN messages reply ON m.reply_to_id = reply.id
      WHERE (m.sender_id = ${auth.userID} AND m.recipient_id = ${params.userId}) 
         OR (m.sender_id = ${params.userId} AND m.recipient_id = ${auth.userID})
      ORDER BY m.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) {
      messages.push(message);
    }

    return { messages: messages.reverse() };
  }
);
