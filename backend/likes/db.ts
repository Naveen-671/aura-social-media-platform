import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use the shared users database to access likes, posts, and users tables
export const likesDB = SQLDatabase.named("users");
