import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { usersDB } from "./db";

export interface UpdateUserRequest {
  username?: string;
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

// Updates the current user's profile.
export const updateUser = api<UpdateUserRequest, User>(
  { auth: true, expose: true, method: "PUT", path: "/users/me" },
  async (req) => {
    const auth = getAuthData()!;

    if (req.username) {
      await usersDB.exec`
        UPDATE users 
        SET username = ${req.username}, updated_at = NOW()
        WHERE id = ${auth.userID}
      `;
    }

    if (req.bio !== undefined) {
      await usersDB.exec`
        UPDATE users 
        SET bio = ${req.bio}, updated_at = NOW()
        WHERE id = ${auth.userID}
      `;
    }

    const user = await usersDB.queryRow<User>`
      SELECT id, username, image_url as "imageUrl", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${auth.userID}
    `;

    return user!;
  }
);
