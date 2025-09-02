import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use the shared users database to access messages and related tables
export const messagesDB = SQLDatabase.named("users");
