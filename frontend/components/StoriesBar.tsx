import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import StoryModal from "./StoryModal";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isOwn?: boolean;
  storyImage?: string;
  storyVideo?: string;
}

export default function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const stories: Story[] = [
    { 
      id: "your_story", 
      username: "Your Story", 
      avatar: "", 
      hasStory: false, 
      isOwn: true 
    },
    { 
      id: "1", 
      username: "alex_photographer", 
      avatar: "https://i.pravatar.cc/150?img=1", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    },
    { 
      id: "2", 
      username: "sarah_travels", 
      avatar: "https://i.pravatar.cc/150?img=2", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
    },
    { 
      id: "3", 
      username: "urban_artist", 
      avatar: "https://i.pravatar.cc/150?img=3", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800"
    },
    { 
      id: "4", 
      username: "food_explorer", 
      avatar: "https://i.pravatar.cc/150?img=4", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800"
    },
    { 
      id: "5", 
      username: "nature_lover", 
      avatar: "https://i.pravatar.cc/150?img=5", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800"
    },
    { 
      id: "6", 
      username: "creative_soul", 
      avatar: "https://i.pravatar.cc/150?img=6", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800"
    },
    { 
      id: "7", 
      username: "fitness_guru", 
      avatar: "https://i.pravatar.cc/150?img=7", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
    },
    { 
      id: "8", 
      username: "tech_wanderer", 
      avatar: "https://i.pravatar.cc/150?img=8", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1551334787-21e682472b24?w=800"
    },
    { 
      id: "9", 
      username: "music_vibes", 
      avatar: "https://i.pravatar.cc/150?img=9", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800"
    },
    { 
      id: "10", 
      username: "art_enthusiast", 
      avatar: "https://i.pravatar.cc/150?img=10", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800"
    },
    { 
      id: "11", 
      username: "yoga_flow", 
      avatar: "https://i.pravatar.cc/150?img=11", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
    },
    { 
      id: "12", 
      username: "ocean_explorer", 
      avatar: "https://i.pravatar.cc/150?img=12", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    },
    { 
      id: "13", 
      username: "book_lover", 
      avatar: "https://i.pravatar.cc/150?img=13", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    },
    { 
      id: "14", 
      username: "coffee_addict", 
      avatar: "https://i.pravatar.cc/150?img=14", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800"
    },
    { 
      id: "15", 
      username: "minimalist_life", 
      avatar: "https://i.pravatar.cc/150?img=15", 
      hasStory: true,
      storyImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800"
    },
  ];

  const handleStoryClick = (story: Story) => {
    if (story.isOwn) {
      // Handle adding own story
      return;
    }
    setSelectedStory(story);
  };

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/30 hover:scrollbar-thumb-purple-500/50">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-2 min-w-max cursor-pointer group"
              onClick={() => handleStoryClick(story)}
            >
              <div className="relative">
                {story.isOwn ? (
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-purple-400 transition-all duration-200 group-hover:scale-105">
                      <Plus size={24} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full p-[2px] ${
                      story.hasStory 
                        ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500" 
                        : "bg-gray-600"
                    } group-hover:scale-105 transition-all duration-200`}>
                      <Avatar className="w-full h-full ring-2 ring-gray-800">
                        <AvatarImage src={story.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                          {story.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {story.hasStory && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-300 max-w-[64px] text-center truncate group-hover:text-purple-300 transition-colors">
                {story.isOwn ? "Add Story" : story.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <StoryModal 
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </>
  );
}
