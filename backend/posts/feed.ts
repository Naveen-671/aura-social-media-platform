import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { postsDB } from "./db";

export interface GetFeedParams {
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

export interface GetFeedResponse {
  posts: PostWithAuthor[];
}

// Gets the feed of posts from users the current user follows.
export const getFeed = api<GetFeedParams, GetFeedResponse>(
  { auth: true, expose: true, method: "GET", path: "/posts/feed" },
  async (params) => {
    const auth = getAuthData()!;
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    const posts: PostWithAuthor[] = [];
    for await (const post of postsDB.query<PostWithAuthor>`
      SELECT p.id, p.image_url as "imageUrl", p.caption, p.author_id as "authorId",
             u.username as "authorUsername", u.image_url as "authorImageUrl",
             p.created_at as "createdAt", p.updated_at as "updatedAt"
      FROM posts p
      JOIN users u ON p.author_id = u.id
      JOIN follows f ON p.author_id = f.following_id
      WHERE f.follower_id = ${auth.userID}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) {
      posts.push(post);
    }

    return { posts };
  }
);
