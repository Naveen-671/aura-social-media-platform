import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { likesDB } from "./db";

export interface GetPostLikesParams {
  postId: Query<number>;
}

export interface GetPostLikesResponse {
  likeCount: number;
  isLiked: boolean;
}

// Gets like information for a post.
export const getPostLikes = api<GetPostLikesParams, GetPostLikesResponse>(
  { auth: true, expose: true, method: "GET", path: "/likes/post" },
  async (params) => {
    const auth = getAuthData()!;

    const likeCountResult = await likesDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM likes WHERE post_id = ${params.postId}
    `;

    const userLike = await likesDB.queryRow<{ user_id: string }>`
      SELECT user_id FROM likes 
      WHERE user_id = ${auth.userID} AND post_id = ${params.postId}
    `;

    return {
      likeCount: likeCountResult?.count || 0,
      isLiked: !!userLike,
    };
  }
);
