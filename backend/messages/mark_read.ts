import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { messagesDB } from "./db";

export interface MarkMessagesReadRequest {
  userId: string;
}

// Marks all messages from a user as read.
export const markMessagesRead = api<MarkMessagesReadRequest, void>(
  { auth: true, expose: true, method: "POST", path: "/messages/mark-read" },
  async (req) => {
    const auth = getAuthData()!;

    await messagesDB.exec`
      UPDATE messages 
      SET is_read = true, updated_at = NOW()
      WHERE sender_id = ${req.userId} AND recipient_id = ${auth.userID} AND is_read = false
    `;
  }
);
