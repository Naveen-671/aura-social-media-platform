import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { postsDB } from "./db";

export interface CreatePostRequest {
  imageUrl: string;
  caption?: string;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new post.
export const createPost = api<CreatePostRequest, Post>(
  { auth: true, expose: true, method: "POST", path: "/posts" },
  async (req) => {
    const auth = getAuthData()!;

    const result = await postsDB.queryRow<{ id: number }>`
      INSERT INTO posts (image_url, caption, author_id)
      VALUES (${req.imageUrl}, ${req.caption || null}, ${auth.userID})
      RETURNING id
    `;

    const post = await postsDB.queryRow<Post>`
      SELECT id, image_url as "imageUrl", caption, author_id as "authorId", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM posts 
      WHERE id = ${result!.id}
    `;

    return post!;
  }
);
