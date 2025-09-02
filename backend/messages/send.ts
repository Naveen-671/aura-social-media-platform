import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { messagesDB } from "./db";

export interface SendMessageRequest {
  recipientId: string;
  content: string;
  messageType: "text" | "image" | "video" | "audio";
  mediaUrl?: string;
  replyToId?: number;
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

// Sends a message to another user.
export const sendMessage = api<SendMessageRequest, Message>(
  { auth: true, expose: true, method: "POST", path: "/messages" },
  async (req) => {
    const auth = getAuthData()!;

    const result = await messagesDB.queryRow<{ id: number }>`
      INSERT INTO messages (sender_id, recipient_id, content, message_type, media_url, reply_to_id)
      VALUES (${auth.userID}, ${req.recipientId}, ${req.content}, ${req.messageType}, ${req.mediaUrl || null}, ${req.replyToId || null})
      RETURNING id
    `;

    const message = await messagesDB.queryRow<Message>`
      SELECT m.id, m.sender_id as "senderId", u.username as "senderUsername", u.image_url as "senderImageUrl",
             m.recipient_id as "recipientId", m.content, m.message_type as "messageType", 
             m.media_url as "mediaUrl", m.reply_to_id as "replyToId",
             reply.content as "replyToContent", m.is_read as "isRead",
             m.created_at as "createdAt", m.updated_at as "updatedAt"
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      LEFT JOIN messages reply ON m.reply_to_id = reply.id
      WHERE m.id = ${result!.id}
    `;

    return message!;
  }
);
