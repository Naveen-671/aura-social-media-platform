import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../hooks/useBackend";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { user } = useUser();
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => backend.comments.listComments({ postId }),
  });

  const createCommentMutation = useMutation({
    mutationFn: (text: string) =>
      backend.comments.createComment({ postId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewComment("");
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      backend.comments.deleteComment({ id: commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast({
        title: "Comment deleted",
        description: "Comment removed successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment.trim());
    }
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  if (isLoading) {
    return (
      <div className="border-t border-gray-700/50 p-4">
        <p className="text-sm text-gray-400">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-700/50 bg-gray-800/30">
      {/* Comments list */}
      {commentsData?.comments && commentsData.comments.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          {commentsData.comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/20 transition-colors">
              <Link to={`/profile/${comment.authorId}`}>
                <Avatar className="h-8 w-8 ring-1 ring-purple-500/30">
                  <AvatarImage src={comment.authorImageUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                    {comment.authorUsername.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <Link
                    to={`/profile/${comment.authorId}`}
                    className="font-semibold text-white hover:text-purple-300 mr-2 transition-colors"
                  >
                    {comment.authorUsername}
                  </Link>
                  <span className="text-gray-200">{comment.text}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user?.id === comment.authorId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="p-1 h-auto text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8 ring-1 ring-purple-500/30">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || createCommentMutation.isPending}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-4 transition-all duration-200 hover:scale-105"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
