import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { commentsDB } from "./db";

export interface DeleteCommentParams {
  id: number;
}

// Deletes a comment (only by the author).
export const deleteComment = api<DeleteCommentParams, void>(
  { auth: true, expose: true, method: "DELETE", path: "/comments/:id" },
  async (params) => {
    const auth = getAuthData()!;

    const comment = await commentsDB.queryRow<{ author_id: string }>`
      SELECT author_id FROM comments WHERE id = ${params.id}
    `;

    if (!comment) {
      throw APIError.notFound("comment not found");
    }

    if (comment.author_id !== auth.userID) {
      throw APIError.permissionDenied("can only delete your own comments");
    }

    await commentsDB.exec`DELETE FROM comments WHERE id = ${params.id}`;
  }
);
