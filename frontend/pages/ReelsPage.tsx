import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share, MoreVertical, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  author: {
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export default function ReelsPage() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const reels: Reel[] = [
    {
      id: "1",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      caption: "Morning workout motivation! 💪 Starting my day with some energy ⚡ #fitness #motivation #morningworkout",
      author: {
        username: "fitness_guru",
        avatar: "https://i.pravatar.cc/150?img=7",
      },
      likes: 1247,
      comments: 89,
      shares: 23,
      isLiked: false,
    },
    {
      id: "2",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
      caption: "Quick pasta recipe that'll blow your mind! 🍝✨ Save this for later! #cooking #pasta #recipe #quickmeals",
      author: {
        username: "food_explorer",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      likes: 2156,
      comments: 312,
      shares: 89,
      isLiked: true,
    },
    {
      id: "3",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400",
      caption: "Behind the scenes of my latest track 🎵 The creative process is everything! #music #producer #studio #beats",
      author: {
        username: "music_vibes",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      likes: 892,
      comments: 156,
      shares: 34,
      isLiked: false,
    },
    {
      id: "4",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      caption: "Nature's therapy session 🌲 Sometimes you just need to disconnect and breathe #nature #mindfulness #forest",
      author: {
        username: "nature_lover",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      likes: 1678,
      comments: 234,
      shares: 67,
      isLiked: true,
    },
    {
      id: "5",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400",
      caption: "Art in motion 🎨 Watch this piece come to life! #art #painting #creative #process #timelapse",
      author: {
        username: "art_enthusiast",
        avatar: "https://i.pravatar.cc/150?img=10",
      },
      likes: 945,
      comments: 178,
      shares: 45,
      isLiked: false,
    },
  ];

  const currentReel = reels[currentReelIndex];

  useEffect(() => {
    // Auto-play current video
    const currentVideo = videoRefs.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      if (isPlaying) {
        currentVideo.play().catch(console.error);
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentReelIndex) {
        video.pause();
      }
    });
  }, [currentReelIndex, isPlaying]);

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (e.deltaY < 0 && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentReelIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const currentVideo = videoRefs.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" onWheel={handleScroll}>
      <div className="relative h-full">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentReelIndex ? 'translate-y-0' : 
              index < currentReelIndex ? '-translate-y-full' : 'translate-y-full'
            }`}
          >
            {/* Video */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-full h-full object-cover"
                poster={reel.thumbnailUrl}
                muted={isMuted}
                loop
                playsInline
                onClick={togglePlayPause}
              >
                <source src={reel.videoUrl} type="video/mp4" />
                {/* Fallback for video not loading - show image */}
                <img 
                  src={reel.thumbnailUrl} 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              </video>

              {/* Play/Pause overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={togglePlayPause}
                    className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Play size={32} fill="currentColor" />
                  </Button>
                </div>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Controls overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top controls */}
              <div className="absolute top-4 right-4 pointer-events-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
              </div>

              {/* Right sidebar */}
              <div className="absolute right-4 bottom-24 flex flex-col space-y-6 pointer-events-auto">
                {/* Like button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-12 rounded-full ${
                      reel.isLiked ? 'text-red-500' : 'text-white'
                    } hover:scale-110 transition-all duration-200`}
                  >
                    <Heart size={28} fill={reel.isLiked ? 'currentColor' : 'none'} />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1">
                    {reel.likes.toLocaleString()}
                  </span>
                </div>

                {/* Comment button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full text-white hover:scale-110 transition-all duration-200"
                  >
                    <MessageCircle size={28} />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1">
                    {reel.comments}
                  </span>
                </div>

                {/* Share button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full text-white hover:scale-110 transition-all duration-200"
                  >
                    <Share size={28} />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1">
                    {reel.shares}
                  </span>
                </div>

                {/* More options */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full text-white hover:scale-110 transition-all duration-200"
                >
                  <MoreVertical size={28} />
                </Button>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-24 left-4 right-20 pointer-events-auto">
                {/* Author info */}
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={reel.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {reel.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-semibold">@{reel.author.username}</span>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-1 text-sm font-semibold"
                  >
                    Follow
                  </Button>
                </div>

                {/* Caption */}
                <p className="text-white text-sm leading-relaxed pr-4">
                  {reel.caption}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentReelIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
