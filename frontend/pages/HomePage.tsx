import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";
import { useBackend } from "../hooks/useBackend";
import { Camera, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  const backend = useBackend();

  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: () => backend.posts.getFeed({}),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  <div className="h-3 w-16 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="aspect-square bg-gray-700 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">Failed to load feed. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!feedData?.posts || feedData.posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <Camera size={32} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles size={24} className="text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Aura! ✨</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your feed is waiting to be filled with amazing moments.<br />
            Follow some users to see their posts here, or explore to discover new content.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Connect with friends</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera size={16} />
              <span>Share your story</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="space-y-6">
        {feedData.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
