import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { postsDB } from "./db";

export interface ListPostsParams {
  authorId?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
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

export interface ListPostsResponse {
  posts: PostWithAuthor[];
}

// Lists posts with author information.
export const listPosts = api<ListPostsParams, ListPostsResponse>(
  { expose: true, method: "GET", path: "/posts" },
  async (params) => {
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    const posts: PostWithAuthor[] = [];

    if (params.authorId) {
      for await (const post of postsDB.query<PostWithAuthor>`
        SELECT p.id, p.image_url as "imageUrl", p.caption, p.author_id as "authorId",
               u.username as "authorUsername", u.image_url as "authorImageUrl",
               p.created_at as "createdAt", p.updated_at as "updatedAt"
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.author_id = ${params.authorId}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `) {
        posts.push(post);
      }
    } else {
      for await (const post of postsDB.query<PostWithAuthor>`
        SELECT p.id, p.image_url as "imageUrl", p.caption, p.author_id as "authorId",
               u.username as "authorUsername", u.image_url as "authorImageUrl",
               p.created_at as "createdAt", p.updated_at as "updatedAt"
        FROM posts p
        JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `) {
        posts.push(post);
      }
    }

    return { posts };
  }
);
