import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import type { PostWithAuthor } from "~backend/posts/list";

interface PostGridProps {
  posts: PostWithAuthor[];
}

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-6 bg-gray-800/50 rounded-full">
            <MessageCircle size={48} className="text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg">No posts yet</p>
          <p className="text-gray-500 text-sm">Share your first moment with the community!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="aspect-square block group relative overflow-hidden rounded-lg md:rounded-xl"
        >
          <img
            src={post.imageUrl}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <Heart size={20} fill="white" />
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={20} fill="white" />
                <span className="font-semibold">8</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
