import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, ImageIcon } from "lucide-react";
import { useBackend } from "../hooks/useBackend";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
        throw new Error("Failed to upload image");
      }

      return publicUrl;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; caption?: string }) => {
      return backend.posts.createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
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
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      const imageUrl = await uploadMutation.mutateAsync(selectedFile);
      await createPostMutation.mutateAsync({
        imageUrl,
        caption: caption.trim() || undefined,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCaption("");
    setPreviewUrl(null);
    onOpenChange(false);
  };

  const isLoading = uploadMutation.isPending || createPostMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 bg-gray-700/30">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                  <ImageIcon className="h-8 w-8 text-purple-400" />
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-white hover:text-purple-300 transition-colors">
                    Click to upload an image
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white border-0 rounded-full p-2 backdrop-blur-sm"
              >
                <X size={16} />
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="caption" className="text-white font-medium">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Share what's on your mind..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Share Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
