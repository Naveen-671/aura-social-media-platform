import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../hooks/useBackend";
import CommentSection from "./CommentSection";
import type { PostWithAuthor } from "~backend/posts/list";

interface PostCardProps {
  post: PostWithAuthor;
  initialLikes?: number;
  initialComments?: number;
}

export default function PostCard({ post, initialLikes = 0, initialComments = 0 }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [commentCount, setCommentCount] = useState(initialComments);
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const { data: likeData } = useQuery({
    queryKey: ["post-likes", post.id],
    queryFn: () => backend.likes.getPostLikes({ postId: post.id }),
    enabled: false, // Disable auto-fetch for demo
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => backend.likes.toggleLike({ postId: post.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes", post.id] });
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    },
    onError: (error) => {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    // Optionally call the backend mutation
    // toggleLikeMutation.mutate();
  };

  const handleShare = () => {
    toast({
      title: "Shared! ✨",
      description: "Post shared successfully.",
    });
  };

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Saved! 📌",
      description: saved ? "Post removed from your saved items." : "Post saved to your collection.",
    });
  };

  const timeAgo = () => {
    const now = new Date();
    const postDate = new Date(post.createdAt);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 7)}w`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 mb-6 transition-all duration-300 hover:border-purple-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          to={`/profile/${post.authorId}`}
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all duration-200">
              <AvatarImage src={post.authorImageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {post.authorUsername.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              {post.authorUsername}
            </p>
            <p className="text-xs text-gray-400">
              {timeAgo()} ago
            </p>
          </div>
        </Link>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square group">
        <img
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
        {/* Double tap to like overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none">
          <Heart
            size={80}
            className="text-white drop-shadow-2xl animate-ping"
            fill="white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-0 h-auto transition-all duration-200 hover:scale-110 group ${
                liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
            >
              <Heart
                size={28}
                fill={liked ? "currentColor" : "none"}
                className="drop-shadow-lg group-active:scale-125 transition-transform duration-150"
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110 group"
            >
              <MessageCircle size={28} className="drop-shadow-lg group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-0 h-auto text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110 group"
            >
              <Share size={28} className="drop-shadow-lg group-hover:scale-110 transition-transform" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={`p-0 h-auto transition-all duration-200 hover:scale-110 group ${
              saved ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
            }`}
          >
            <Bookmark size={28} fill={saved ? "currentColor" : "none"} className="drop-shadow-lg group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <p className="font-semibold text-white mb-3 text-lg hover:text-purple-300 cursor-pointer transition-colors">
            {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="text-gray-100 mb-3 leading-relaxed">
            <Link
              to={`/profile/${post.authorId}`}
              className="font-semibold text-white hover:text-purple-300 mr-2 transition-colors"
            >
              {post.authorUsername}
            </Link>
            <span className="whitespace-pre-wrap">{post.caption}</span>
          </div>
        )}

        {/* View comments button */}
        {commentCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-400 hover:text-gray-200 p-0 h-auto font-normal mb-2 transition-colors"
          >
            View all {commentCount} comments
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-gray-400 hover:text-gray-200 p-0 h-auto font-normal transition-colors"
        >
          {showComments ? "Hide comments" : "Add a comment..."}
        </Button>
      </div>

      {/* Comments */}
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}
