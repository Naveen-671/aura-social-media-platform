import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use the shared users database to access follows and users tables
export const followsDB = SQLDatabase.named("users");
