import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { followsDB } from "./db";

export interface GetFollowStatusParams {
  userId: Query<string>;
}

export interface GetFollowStatusResponse {
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

// Gets follow status and counts for a user.
export const getFollowStatus = api<GetFollowStatusParams, GetFollowStatusResponse>(
  { auth: true, expose: true, method: "GET", path: "/follows/status" },
  async (params) => {
    const auth = getAuthData()!;

    const isFollowingResult = await followsDB.queryRow<{ follower_id: string }>`
      SELECT follower_id FROM follows 
      WHERE follower_id = ${auth.userID} AND following_id = ${params.userId}
    `;

    const followerCountResult = await followsDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM follows WHERE following_id = ${params.userId}
    `;

    const followingCountResult = await followsDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM follows WHERE follower_id = ${params.userId}
    `;

    return {
      isFollowing: !!isFollowingResult,
      followerCount: followerCountResult?.count || 0,
      followingCount: followingCountResult?.count || 0,
    };
  }
);
