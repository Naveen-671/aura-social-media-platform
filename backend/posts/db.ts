import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use the shared users database to access both posts and users tables
export const postsDB = SQLDatabase.named("users");
