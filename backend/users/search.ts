import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { usersDB } from "./db";

export interface SearchUsersParams {
  q: Query<string>;
  limit?: Query<number>;
}

export interface User {
  id: string;
  username: string;
  imageUrl?: string;
  bio?: string;
}

export interface SearchUsersResponse {
  users: User[];
}

// Searches for users by username.
export const searchUsers = api<SearchUsersParams, SearchUsersResponse>(
  { expose: true, method: "GET", path: "/users/search" },
  async (params) => {
    const limit = params.limit || 20;
    const searchTerm = `%${params.q}%`;

    const users: User[] = [];
    for await (const user of usersDB.query<User>`
      SELECT id, username, image_url as "imageUrl", bio
      FROM users 
      WHERE username ILIKE ${searchTerm}
      ORDER BY username
      LIMIT ${limit}
    `) {
      users.push(user);
    }

    return { users };
  }
);
