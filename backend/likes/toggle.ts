import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { likesDB } from "./db";

export interface ToggleLikeRequest {
  postId: number;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

// Toggles a like on a post.
export const toggleLike = api<ToggleLikeRequest, ToggleLikeResponse>(
  { auth: true, expose: true, method: "POST", path: "/likes/toggle" },
  async (req) => {
    const auth = getAuthData()!;

    const existingLike = await likesDB.queryRow<{ user_id: string }>`
      SELECT user_id FROM likes 
      WHERE user_id = ${auth.userID} AND post_id = ${req.postId}
    `;

    let liked: boolean;

    if (existingLike) {
      await likesDB.exec`
        DELETE FROM likes 
        WHERE user_id = ${auth.userID} AND post_id = ${req.postId}
      `;
      liked = false;
    } else {
      await likesDB.exec`
        INSERT INTO likes (user_id, post_id)
        VALUES (${auth.userID}, ${req.postId})
      `;
      liked = true;
    }

    const likeCountResult = await likesDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM likes WHERE post_id = ${req.postId}
    `;

    return {
      liked,
      likeCount: likeCountResult?.count || 0,
    };
  }
);
