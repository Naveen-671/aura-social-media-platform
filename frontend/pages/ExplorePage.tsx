import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Hash, Users } from "lucide-react";
import PostGrid from "../components/PostGrid";
import { useBackend } from "../hooks/useBackend";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const backend = useBackend();

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ["explore-posts"],
    queryFn: () => backend.posts.listPosts({ limit: 30 }),
  });

  const trendingTags = [
    "#photography", "#art", "#nature", "#travel", "#food", "#fashion", "#music", "#fitness"
  ];

  const suggestedUsers = [
    { username: "alex_photographer", followers: "12.5K", avatar: "https://i.pravatar.cc/150?img=1" },
    { username: "sarah_travels", followers: "8.2K", avatar: "https://i.pravatar.cc/150?img=2" },
    { username: "food_explorer", followers: "15.1K", avatar: "https://i.pravatar.cc/150?img=3" },
    { username: "urban_artist", followers: "9.8K", avatar: "https://i.pravatar.cc/150?img=4" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 flex-1 bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 md:gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-700 animate-pulse rounded-lg md:rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">Failed to load posts. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Search size={28} className="mr-3 text-purple-400" />
            Explore
          </h1>
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search posts, people, or hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
            />
          </div>
        </div>

        {/* Trending Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Trending Hashtags */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-purple-400" />
              Trending Hashtags
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Button
                  key={tag}
                  variant="secondary"
                  size="sm"
                  className="bg-gray-700/50 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border border-gray-600 hover:border-purple-500/50 rounded-xl transition-all duration-200"
                >
                  <Hash size={14} className="mr-1" />
                  {tag.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Suggested Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users size={20} className="mr-2 text-purple-400" />
              Suggested for You
            </h3>
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <div key={user.username} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                    />
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.followers} followers</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-4 transition-all duration-200 hover:scale-105"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Discover</h2>
        {postsData?.posts ? (
          <PostGrid posts={postsData.posts} />
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 bg-gray-700/50 rounded-full">
                <Search size={48} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No posts to explore yet</p>
              <p className="text-gray-500 text-sm">Check back later for new content!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
