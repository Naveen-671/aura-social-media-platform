import { api, APIError } from "encore.dev/api";
import { usersDB } from "./db";

export interface GetUserParams {
  id: string;
}

export interface User {
  id: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gets a user by ID.
export const getUser = api<GetUserParams, User>(
  { expose: true, method: "GET", path: "/users/:id" },
  async (params) => {
    const user = await usersDB.queryRow<User>`
      SELECT id, username, image_url as "imageUrl", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users 
      WHERE id = ${params.id}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return user;
  }
);
