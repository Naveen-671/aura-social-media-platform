import { api } from "encore.dev/api";
import { usersDB } from "./db";

export interface SyncUserRequest {
  id: string;
  username: string;
  imageUrl?: string;
  bio?: string;
}

export interface User {
  id: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Syncs user data from Clerk to our database.
export const syncUser = api<SyncUserRequest, User>(
  { expose: true, method: "POST", path: "/users/sync" },
  async (req) => {
    const existingUser = await usersDB.queryRow<User>`
      SELECT id, username, image_url as "imageUrl", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${req.id}
    `;

    if (existingUser) {
      await usersDB.exec`
        UPDATE users 
        SET username = ${req.username}, 
            image_url = ${req.imageUrl || null}, 
            bio = ${req.bio || null},
            updated_at = NOW()
        WHERE id = ${req.id}
      `;
    } else {
      await usersDB.exec`
        INSERT INTO users (id, username, image_url, bio)
        VALUES (${req.id}, ${req.username}, ${req.imageUrl || null}, ${req.bio || null})
      `;
    }

    const user = await usersDB.queryRow<User>`
      SELECT id, username, image_url as "imageUrl", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${req.id}
    `;

    return user!;
  }
);
