import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { commentsDB } from "./db";

export interface CreateCommentRequest {
  postId: number;
  text: string;
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

// Creates a new comment on a post.
export const createComment = api<CreateCommentRequest, CommentWithAuthor>(
  { auth: true, expose: true, method: "POST", path: "/comments" },
  async (req) => {
    const auth = getAuthData()!;

    const result = await commentsDB.queryRow<{ id: number }>`
      INSERT INTO comments (text, author_id, post_id)
      VALUES (${req.text}, ${auth.userID}, ${req.postId})
      RETURNING id
    `;

    const comment = await commentsDB.queryRow<CommentWithAuthor>`
      SELECT c.id, c.text, c.author_id as "authorId", c.post_id as "postId",
             u.username as "authorUsername", u.image_url as "authorImageUrl",
             c.created_at as "createdAt", c.updated_at as "updatedAt"
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = ${result!.id}
    `;

    return comment!;
  }
);
