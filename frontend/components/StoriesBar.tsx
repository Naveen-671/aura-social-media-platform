import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isOwn?: boolean;
}

export default function StoriesBar() {
  const stories: Story[] = [
    { id: "your_story", username: "Your Story", avatar: "", hasStory: false, isOwn: true },
    { id: "1", username: "alex_photographer", avatar: "https://i.pravatar.cc/150?img=1", hasStory: true },
    { id: "2", username: "sarah_travels", avatar: "https://i.pravatar.cc/150?img=2", hasStory: true },
    { id: "3", username: "urban_artist", avatar: "https://i.pravatar.cc/150?img=3", hasStory: true },
    { id: "4", username: "food_explorer", avatar: "https://i.pravatar.cc/150?img=4", hasStory: true },
    { id: "5", username: "nature_lover", avatar: "https://i.pravatar.cc/150?img=5", hasStory: true },
    { id: "6", username: "creative_soul", avatar: "https://i.pravatar.cc/150?img=6", hasStory: true },
    { id: "7", username: "fitness_guru", avatar: "https://i.pravatar.cc/150?img=7", hasStory: true },
    { id: "8", username: "tech_wanderer", avatar: "https://i.pravatar.cc/150?img=8", hasStory: true },
    { id: "9", username: "music_vibes", avatar: "https://i.pravatar.cc/150?img=9", hasStory: true },
    { id: "10", username: "art_enthusiast", avatar: "https://i.pravatar.cc/150?img=10", hasStory: true },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-6 shadow-xl">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-max cursor-pointer group">
            <div className="relative">
              {story.isOwn ? (
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-purple-400 transition-all duration-200">
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
  );
}
