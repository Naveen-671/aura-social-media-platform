import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use the shared users database to access comments, posts, and users tables
export const commentsDB = SQLDatabase.named("users");
