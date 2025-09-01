import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share, MoreVertical, Volume2, VolumeX, Play, Pause, Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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
  music?: {
    name: string;
    artist: string;
  };
}

export default function ReelsPage() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();

  const reels: Reel[] = [
    {
      id: "1",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      caption: "Morning workout motivation! 💪 Starting my day with some energy ⚡ Who's joining me for tomorrow's session? #fitness #motivation #morningworkout #energy #strong",
      author: {
        username: "fitness_guru",
        avatar: "https://i.pravatar.cc/150?img=7",
      },
      likes: 1247,
      comments: 89,
      shares: 23,
      isLiked: false,
      music: {
        name: "Pump It Up",
        artist: "FitnessBeats"
      }
    },
    {
      id: "2",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
      caption: "Quick pasta recipe that'll blow your mind! 🍝✨ Save this for later and tag someone who needs to try this! Full recipe in my bio 👨‍🍳 #cooking #pasta #recipe #quickmeals #italian #foodie",
      author: {
        username: "food_explorer",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      likes: 2156,
      comments: 312,
      shares: 89,
      isLiked: true,
      music: {
        name: "Cooking Vibes",
        artist: "ChefTunes"
      }
    },
    {
      id: "3",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400",
      caption: "Behind the scenes of my latest track 🎵 The creative process is everything! This beat took me 6 hours to perfect. What do you think? 🔥 #music #producer #studio #beats #creative #process",
      author: {
        username: "music_vibes",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      likes: 892,
      comments: 156,
      shares: 34,
      isLiked: false,
      music: {
        name: "Studio Sessions",
        artist: "BeatMaker"
      }
    },
    {
      id: "4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
      caption: "Nature's therapy session 🌲 Sometimes you just need to disconnect and breathe. Three hours in the forest and I feel completely renewed 🧘‍♀️ #nature #mindfulness #forest #peace #therapy",
      author: {
        username: "nature_lover",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      likes: 1678,
      comments: 234,
      shares: 67,
      isLiked: true,
      music: {
        name: "Forest Sounds",
        artist: "Nature Audio"
      }
    },
    {
      id: "5",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400",
      caption: "Art in motion 🎨 Watch this piece come to life! Three weeks of work condensed into 30 seconds. The magic happens in the details ✨ #art #painting #creative #process #timelapse #artist",
      author: {
        username: "art_enthusiast",
        avatar: "https://i.pravatar.cc/150?img=10",
      },
      likes: 945,
      comments: 178,
      shares: 45,
      isLiked: false,
      music: {
        name: "Creative Flow",
        artist: "ArtistVibes"
      }
    },
    {
      id: "6",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
      caption: "Urban symphony at golden hour 🏙️✨ The way light dances between these skyscrapers never gets old. Every frame tells a story 📸 #urban #photography #goldenhour #citylife #architecture",
      author: {
        username: "urban_artist",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      likes: 1534,
      comments: 267,
      shares: 78,
      isLiked: false,
      music: {
        name: "City Nights",
        artist: "UrbanSounds"
      }
    },
    {
      id: "7",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      caption: "Perfect waves at Malibu today! 🌊🏄‍♀️ The ocean called and I answered. Salt water therapy is the best therapy. Who's joining me next time? 💙 #surfing #malibu #ocean #waves #therapy",
      author: {
        username: "sarah_travels",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      likes: 2341,
      comments: 445,
      shares: 123,
      isLiked: true,
      music: {
        name: "Ocean Waves",
        artist: "BeachVibes"
      }
    },
    {
      id: "8",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800",
      caption: "Sunset yoga flow on the beach 🧘‍♀️🌅 Connecting breath with movement as the day transitions to night. Pure bliss and presence 🙏 #yoga #sunset #beach #mindfulness #flow #peace",
      author: {
        username: "yoga_flow",
        avatar: "https://i.pravatar.cc/150?img=11",
      },
      likes: 1876,
      comments: 289,
      shares: 95,
      isLiked: false,
      music: {
        name: "Zen Meditation",
        artist: "YogaSounds"
      }
    },
    {
      id: "9",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1558618047-d7df20d1aeda?w=800",
      caption: "Summit conquered! ⛰️🎯 12 hours of climbing but this view from 14,000 feet makes every step worth it. Adventure is calling! 💪 #mountaineering #summit #adventure #climbing #nature",
      author: {
        username: "alex_photographer",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      likes: 3456,
      comments: 567,
      shares: 189,
      isLiked: true,
      music: {
        name: "Mountain High",
        artist: "AdventureBeats"
      }
    },
    {
      id: "10",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800",
      caption: "Perfect espresso shot! ☕✨ Single origin Ethiopian beans, 25-second extraction, perfect crema. The art of coffee is precision and passion ❤️ #coffee #espresso #barista #specialty #art",
      author: {
        username: "coffee_addict",
        avatar: "https://i.pravatar.cc/150?img=14",
      },
      likes: 987,
      comments: 134,
      shares: 42,
      isLiked: false,
      music: {
        name: "Cafe Vibes",
        artist: "CoffeeHouse"
      }
    },
  ];

  const currentReel = reels[currentReelIndex];

  useEffect(() => {
    // Auto-play current video
    const currentVideo = videoRefs.current[currentReelIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.muted = isMuted;
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
  }, [currentReelIndex, isPlaying, isMuted]);

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (e.deltaY < 0 && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const difference = touchStart - touchEnd;
    
    if (Math.abs(difference) > 50) { // Minimum swipe distance
      if (difference > 0 && currentReelIndex < reels.length - 1) {
        // Swipe up - next reel
        setCurrentReelIndex(currentReelIndex + 1);
      } else if (difference < 0 && currentReelIndex > 0) {
        // Swipe down - previous reel
        setCurrentReelIndex(currentReelIndex - 1);
      }
    }
    
    setTouchStart(null);
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

  const toggleLike = (reelId: string) => {
    setLikedReels(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(reelId)) {
        newLiked.delete(reelId);
      } else {
        newLiked.add(reelId);
      }
      return newLiked;
    });
  };

  const isReelLiked = (reelId: string) => {
    return likedReels.has(reelId) || currentReel.isLiked;
  };

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden" 
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      <div className="relative h-full">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-transform duration-500 ease-out ${
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
                onLoadedData={() => {
                  if (index === currentReelIndex && isPlaying) {
                    videoRefs.current[index]?.play().catch(console.error);
                  }
                }}
              >
                <source src={reel.videoUrl} type="video/mp4" />
              </video>

              {/* Play/Pause overlay */}
              {!isPlaying && index === currentReelIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 animate-in fade-in duration-200">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={togglePlayPause}
                    className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  >
                    <Play size={32} fill="currentColor" />
                  </Button>
                </div>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Controls overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top controls */}
              <div className="absolute top-4 right-4 pointer-events-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
              </div>

              {/* Right sidebar */}
              <div className="absolute right-4 bottom-32 flex flex-col space-y-6 pointer-events-auto">
                {/* Profile picture */}
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-white/30">
                    <AvatarImage src={reel.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {reel.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>

                {/* Like button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(reel.id)}
                    className={`w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 ${
                      isReelLiked(reel.id) ? 'text-red-500' : 'text-white hover:text-red-400'
                    }`}
                  >
                    <Heart 
                      size={28} 
                      fill={isReelLiked(reel.id) ? 'currentColor' : 'none'}
                      className="drop-shadow-lg"
                    />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1 drop-shadow-lg">
                    {(reel.likes + (isReelLiked(reel.id) && !reel.isLiked ? 1 : 0) - (reel.isLiked && !isReelLiked(reel.id) ? 1 : 0)).toLocaleString()}
                  </span>
                </div>

                {/* Comment button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full text-white hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  >
                    <MessageCircle size={28} className="drop-shadow-lg" />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1 drop-shadow-lg">
                    {reel.comments}
                  </span>
                </div>

                {/* Share button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full text-white hover:text-green-400 transition-all duration-200 hover:scale-110"
                  >
                    <Share size={28} className="drop-shadow-lg" />
                  </Button>
                  <span className="text-white text-xs font-semibold mt-1 drop-shadow-lg">
                    {reel.shares}
                  </span>
                </div>

                {/* More options */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                >
                  <MoreVertical size={28} className="drop-shadow-lg" />
                </Button>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-6 left-4 right-20 pointer-events-auto">
                {/* Author info */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-white font-semibold drop-shadow-lg">@{reel.author.username}</span>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-1 text-sm font-semibold transition-all duration-200 hover:scale-105"
                  >
                    Follow
                  </Button>
                </div>

                {/* Caption */}
                <p className="text-white text-sm leading-relaxed pr-4 mb-3 drop-shadow-lg">
                  {reel.caption}
                </p>

                {/* Music info */}
                {reel.music && (
                  <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2 w-fit">
                    <Music size={16} className="text-white" />
                    <span className="text-white text-xs">
                      {reel.music.name} • {reel.music.artist}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Scroll indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 z-40">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-6 rounded-full transition-all duration-300 ${
                index === currentReelIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
