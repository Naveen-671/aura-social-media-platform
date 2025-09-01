import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, MoreHorizontal, X } from "lucide-react";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  storyImage?: string;
  storyVideo?: string;
}

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!story) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 0;
        }
        return prev + 2; // Story duration: 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <Dialog open={!!story} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 bg-black max-w-md mx-auto h-[80vh] overflow-hidden rounded-2xl">
        <div className="relative w-full h-full">
          {/* Progress bar */}
          <div className="absolute top-2 left-2 right-2 z-20">
            <div className="w-full h-1 bg-gray-600/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-white/30">
                <AvatarImage src={story.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                  {story.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-medium text-sm">{story.username}</span>
              <span className="text-white/70 text-xs">2h</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Story content */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            {story.storyImage && (
              <img
                src={story.storyImage}
                alt={`${story.username}'s story`}
                className="w-full h-full object-cover"
              />
            )}
            {story.storyVideo && (
              <video
                src={story.storyVideo}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            )}
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />

          {/* Bottom actions */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-full px-4 py-3 border border-white/20">
                <input
                  type="text"
                  placeholder="Send message"
                  className="w-full bg-transparent text-white placeholder-white/70 text-sm focus:outline-none"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 rounded-full p-3"
              >
                <Heart size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 rounded-full p-3"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>

          {/* Click area to pause */}
          <div 
            className="absolute inset-0 z-10"
            onClick={(e) => {
              e.preventDefault();
              // Pause functionality could be added here
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
