import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { commentsDB } from "./db";

export interface ListCommentsParams {
  postId: Query<number>;
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface CommentWithAuthor {
  id: number;
  text: string;
  authorId: string;
  authorUsername: string;
  authorImageUrl?: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListCommentsResponse {
  comments: CommentWithAuthor[];
}

// Lists comments for a post.
export const listComments = api<ListCommentsParams, ListCommentsResponse>(
  { expose: true, method: "GET", path: "/comments" },
  async (params) => {
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    const comments: CommentWithAuthor[] = [];
    for await (const comment of commentsDB.query<CommentWithAuthor>`
      SELECT c.id, c.text, c.author_id as "authorId", c.post_id as "postId",
             u.username as "authorUsername", u.image_url as "authorImageUrl",
             c.created_at as "createdAt", c.updated_at as "updatedAt"
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_id = ${params.postId}
      ORDER BY c.created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `) {
      comments.push(comment);
    }

    return { comments };
  }
);
