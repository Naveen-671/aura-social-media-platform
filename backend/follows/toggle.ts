import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { followsDB } from "./db";

export interface ToggleFollowRequest {
  userId: string;
}

export interface ToggleFollowResponse {
  following: boolean;
}

// Toggles following a user.
export const toggleFollow = api<ToggleFollowRequest, ToggleFollowResponse>(
  { auth: true, expose: true, method: "POST", path: "/follows/toggle" },
  async (req) => {
    const auth = getAuthData()!;

    if (auth.userID === req.userId) {
      throw APIError.invalidArgument("cannot follow yourself");
    }

    const existingFollow = await followsDB.queryRow<{ follower_id: string }>`
      SELECT follower_id FROM follows 
      WHERE follower_id = ${auth.userID} AND following_id = ${req.userId}
    `;

    let following: boolean;

    if (existingFollow) {
      await followsDB.exec`
        DELETE FROM follows 
        WHERE follower_id = ${auth.userID} AND following_id = ${req.userId}
      `;
      following = false;
    } else {
      await followsDB.exec`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${auth.userID}, ${req.userId})
      `;
      following = true;
    }

    return { following };
  }
);
