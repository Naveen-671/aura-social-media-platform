import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "../components/PostCard";
import { useBackend } from "../hooks/useBackend";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const backend = useBackend();

  const { data: postData, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => backend.posts.getPost({ id: parseInt(postId!) }),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="h-10 w-20 bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse">
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
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 mb-4">Post not found</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Link to="/">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
      </div>
      
      <PostCard post={postData} />
    </div>
  );
}
