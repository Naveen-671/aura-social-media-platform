// import { useQuery } from "@tanstack/react-query";
// import { useParams, Link } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import PostCard from "../components/PostCard";
// import { useBackend } from "../hooks/useBackend";

// export default function PostPage() {
//   const { postId } = useParams<{ postId: string }>();
//   const backend = useBackend();

//   const { data: postData, isLoading, error } = useQuery({
//     queryKey: ["post", postId],
//     queryFn: () => backend.posts.getPost({ id: parseInt(postId!) }),
//     enabled: !!postId,
//   });

//   if (isLoading) {
//     return (
//       <div className="max-w-2xl mx-auto py-6 px-4">
//         <div className="mb-6">
//           <div className="h-10 w-20 bg-gray-700 rounded-xl animate-pulse"></div>
//         </div>
//         <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse">
//           <div className="flex items-center space-x-3 mb-4">
//             <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
//             <div className="space-y-2">
//               <div className="h-4 w-24 bg-gray-700 rounded"></div>
//               <div className="h-3 w-16 bg-gray-700 rounded"></div>
//             </div>
//           </div>
//           <div className="aspect-square bg-gray-700 rounded-xl mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 w-16 bg-gray-700 rounded"></div>
//             <div className="h-4 w-full bg-gray-700 rounded"></div>
//             <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !postData) {
//     return (
//       <div className="max-w-2xl mx-auto py-8 px-4 text-center">
//         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
//           <p className="text-red-400 mb-4">Post not found</p>
//           <Link to="/">
//             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl">
//               <ArrowLeft size={16} className="mr-2" />
//               Back to Home
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-6 px-4">
//       <div className="mb-6">
//         <Link to="/">
//           <Button 
//             variant="outline" 
//             size="sm"
//             className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 rounded-xl transition-all duration-200"
//           >
//             <ArrowLeft size={16} className="mr-2" />
//             Back
//           </Button>
//         </Link>
//       </div>
      
//       <PostCard post={postData} />
//     </div>
//   );
// }


// postPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "../components/PostCard";
import { useBackend } from "../hooks/useBackend";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const backend = useBackend();
  const qc = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const id = postId ? parseInt(postId, 10) : NaN;

  const { data: postData, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => backend.posts.getPost({ id }),
    enabled: !!postId && !Number.isNaN(id),
  });

  const commentCreate = useMutation({
    mutationFn: (payload: { postId: number; text: string }) =>
      backend.comments.create({ postId: payload.postId, text: payload.text }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", id] });
      qc.invalidateQueries({ queryKey: ["user-posts"] });
      // let other pieces of UI know activity changed
      window.dispatchEvent(new CustomEvent("activityUpdated"));
      setCommentText("");
    },
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentCreate.mutate({ postId: id, text: commentText.trim() });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* skeleton (unchanged) */}
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

      {/* Comments area */}
      <div className="mt-6 bg-gray-800/40 border border-gray-700/30 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Comments</h3>

        <div className="space-y-3">
          {(postData.comments || []).map((c: any) => (
            <div key={c.id} className="flex items-start space-x-3">
              <img src={c.user?.avatar || `https://i.pravatar.cc/40?u=${c.user?.username}`} className="w-9 h-9 rounded-full" />
              <div>
                <div className="text-sm text-gray-200">
                  <span className="font-semibold text-white mr-2">{c.user?.username}</span>
                  <span className="text-gray-400">{c.text}</span>
                </div>
                <div className="text-xs text-gray-500">{c.timeAgo || c.createdAt}</div>
              </div>
            </div>
          ))}

          <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center space-x-3">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-900/40 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-4">
              {commentCreate.isLoading ? "Posting..." : "Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
