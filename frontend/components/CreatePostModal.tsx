import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, ImageIcon, VideoIcon, Sparkles } from "lucide-react";
import { useBackend } from "../hooks/useBackend";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const { toast } = useToast();
  const backend = useBackend();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Get upload URL
      const { uploadUrl, publicUrl } = await backend.storage.getUploadUrl({
        filename: file.name,
        contentType: file.type,
      });

      // Upload file
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload media");
      }

      return publicUrl;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; caption?: string }) => {
      return backend.posts.createPost(data);
    },
    onSuccess: (newPost) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["real-posts"] });
      
      // Optimistically update the feed if we can
      queryClient.setQueryData(["real-posts"], (oldData: any) => {
        if (oldData?.posts) {
          return {
            ...oldData,
            posts: [newPost, ...oldData.posts]
          };
        }
        return { posts: [newPost] };
      });

      toast({
        title: "Post created! ✨",
        description: "Your post has been shared with the community.",
      });
      handleClose();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Determine file type
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      const mediaUrl = await uploadMutation.mutateAsync(selectedFile);
      await createPostMutation.mutateAsync({
        imageUrl: mediaUrl,
        caption: caption.trim() || undefined,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCaption("");
    setPreviewUrl(null);
    setFileType(null);
    onOpenChange(false);
  };

  const isLoading = uploadMutation.isPending || createPostMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
            <Sparkles size={20} className="mr-2 text-purple-400" />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 bg-gray-700/30 group">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6 text-purple-400" />
                    <VideoIcon className="h-6 w-6 text-pink-400" />
                  </div>
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-white hover:text-purple-300 transition-colors">
                    Upload photo or video
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-gray-400">PNG, JPG, GIF, MP4 up to 100MB</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {fileType === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                  controls
                  muted
                />
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setFileType(null);
                }}
                className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white border-0 rounded-full p-2 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <X size={16} />
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="caption" className="text-white font-medium">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Share what's on your mind... ✨"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
            />
            <p className="text-xs text-gray-400">
              {caption.length}/2200 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {uploadMutation.isPending ? "Uploading..." : "Creating..."}
                </div>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Share Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
