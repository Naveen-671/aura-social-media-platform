import { api, APIError } from "encore.dev/api";
import { postsDB } from "./db";

export interface GetPostParams {
  id: number;
}

export interface PostWithAuthor {
  id: number;
  imageUrl: string;
  caption?: string;
  authorId: string;
  authorUsername: string;
  authorImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gets a post by ID with author information.
export const getPost = api<GetPostParams, PostWithAuthor>(
  { expose: true, method: "GET", path: "/posts/:id" },
  async (params) => {
    const post = await postsDB.queryRow<PostWithAuthor>`
      SELECT p.id, p.image_url as "imageUrl", p.caption, p.author_id as "authorId",
             u.username as "authorUsername", u.image_url as "authorImageUrl",
             p.created_at as "createdAt", p.updated_at as "updatedAt"
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ${params.id}
    `;

    if (!post) {
      throw APIError.notFound("post not found");
    }

    return post;
  }
);
