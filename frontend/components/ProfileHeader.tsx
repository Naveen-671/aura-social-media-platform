import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { Settings, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../hooks/useBackend";
import type { User } from "~backend/users/get";

interface ProfileHeaderProps {
  user: User;
  postCount: number;
}

export default function ProfileHeader({ user, postCount }: ProfileHeaderProps) {
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?.id === user.id;

  const { data: followData } = useQuery({
    queryKey: ["follow-status", user.id],
    queryFn: () => backend.follows.getFollowStatus({ userId: user.id }),
    enabled: !isOwnProfile,
  });

  const toggleFollowMutation = useMutation({
    mutationFn: () => backend.follows.toggleFollow({ userId: user.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", user.id] });
      toast({
        title: followData?.isFollowing ? "Unfollowed" : "Following! ✨",
        description: followData?.isFollowing 
          ? `You unfollowed ${user.username}` 
          : `You are now following ${user.username}`,
      });
    },
    onError: (error) => {
      console.error("Failed to toggle follow:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFollowToggle = () => {
    toggleFollowMutation.mutate();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-2xl shadow-purple-500/10">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <Avatar className="h-32 w-32 ring-4 ring-purple-500/30 shadow-2xl shadow-purple-500/20">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isOwnProfile && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 rounded-xl transition-all duration-200"
              >
                <Settings size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handleFollowToggle}
                  disabled={toggleFollowMutation.isPending}
                  className={`rounded-xl transition-all duration-200 hover:scale-105 ${
                    followData?.isFollowing 
                      ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  }`}
                  size="sm"
                >
                  {followData?.isFollowing ? (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mb-6">
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{postCount}</span>
              <span className="text-gray-400 ml-1 block text-sm">
                {postCount === 1 ? "post" : "posts"}
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{followData?.followerCount || 0}</span>
              <span className="text-gray-400 ml-1 block text-sm">followers</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{followData?.followingCount || 0}</span>
              <span className="text-gray-400 ml-1 block text-sm">following</span>
            </div>
          </div>

          {user.bio && (
            <div className="bg-gray-700/30 rounded-xl p-4 max-w-md mx-auto md:mx-0">
              <p className="text-gray-200 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
