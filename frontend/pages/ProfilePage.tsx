import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Grid, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import { useBackend } from "../hooks/useBackend";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "saved">("posts");
  const backend = useBackend();

  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => backend.users.getUser({ id: userId! }),
    enabled: !!userId,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => backend.posts.listPosts({ authorId: userId }),
    enabled: !!userId,
  });

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse mb-6">
          <div className="flex items-center space-x-8">
            <div className="h-32 w-32 bg-gray-700 rounded-full"></div>
            <div className="space-y-4 flex-1">
              <div className="h-8 w-32 bg-gray-700 rounded"></div>
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
              <div className="flex space-x-8">
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
                <div className="h-6 w-20 bg-gray-700 rounded"></div>
                <div className="h-6 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">User not found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "liked", label: "Liked", icon: Heart },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <ProfileHeader
        user={userData}
        postCount={postsData?.posts.length || 0}
      />

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id as "posts" | "liked" | "saved")}
                className={`flex-1 py-4 rounded-none transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-500/20 text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                }`}
              >
                <IconComponent size={20} className="mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "posts" && (
            <>
              {postsLoading ? (
                <div className="grid grid-cols-3 gap-1 md:gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-700 animate-pulse rounded-lg md:rounded-xl"></div>
                  ))}
                </div>
              ) : (
                <PostGrid posts={postsData?.posts || []} />
              )}
            </>
          )}

          {activeTab === "liked" && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 bg-gray-700/50 rounded-full">
                  <Heart size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No liked posts yet</p>
                <p className="text-gray-500 text-sm">Posts you like will appear here</p>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 bg-gray-700/50 rounded-full">
                  <Bookmark size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No saved posts yet</p>
                <p className="text-gray-500 text-sm">Save posts to view them later</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
