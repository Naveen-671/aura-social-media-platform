import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import { useBackend } from "../hooks/useBackend";
import { Camera, Users, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for instant loading
const mockPosts = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    caption: "Golden hour magic at the mountains! 🌄✨ Nothing beats this view after a 6-hour hike. The journey was tough but moments like these make it all worth it 💫 #mountainlife #goldenhour #hiking #naturephotography #adventure",
    authorId: "user_1",
    authorUsername: "alex_photographer",
    authorImageUrl: "https://i.pravatar.cc/300?img=1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1551334787-21e682472b24?w=800",
    caption: "Coffee and code - the perfect morning combination ☕️💻 Starting the day with some React development and my favorite Ethiopian blend. What's your go-to morning ritual? #coding #coffee #developer #morningvibes #productivity",
    authorId: "user_8",
    authorUsername: "tech_wanderer",
    authorImageUrl: "https://i.pravatar.cc/300?img=8",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
    caption: "Homemade pasta carbonara night! 🍝✨ Fresh eggs from the farmer's market, aged parmesan, and handmade linguine. Cooking from scratch is pure therapy 👨‍🍳 Recipe in my stories! #homecooking #pasta #italianfood #foodie #cooking",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    caption: "5AM sunrise run complete! 🏃‍♂️🌅 10K done and feeling absolutely amazing. There's something magical about having the streets to yourself while the world wakes up. Who else is part of the early bird fitness club? 💪 #running #fitness #sunrise #motivation #earlybird",
    authorId: "user_7",
    authorUsername: "fitness_guru",
    authorImageUrl: "https://i.pravatar.cc/300?img=7",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
    caption: "Lost myself in this enchanted forest today 🌲🍃 Sometimes you need to disconnect from the digital world to reconnect with nature. Three hours of pure peace and mindfulness 🧘‍♀️ #forest #nature #mindfulness #hiking #digitaldetox #peace",
    authorId: "user_5",
    authorUsername: "nature_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=5",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800",
    caption: "New abstract piece finished! 🎨✨ Spent 3 weeks exploring color theory and texture. Art is my language when words aren't enough. This one speaks to me about chaos finding harmony 🌈 #abstract #art #painting #creativity #colors #artistlife",
    authorId: "user_10",
    authorUsername: "art_enthusiast",
    authorImageUrl: "https://i.pravatar.cc/300?img=10",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    caption: "Urban symphony at golden hour 🏙️✨ The way light dances between these skyscrapers never gets old. Every day the city shows me a new face, a new story to capture 📸 #urbanphotography #citylife #goldenhour #architecture #streetphotography",
    authorId: "user_3",
    authorUsername: "urban_artist",
    authorImageUrl: "https://i.pravatar.cc/300?img=3",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800",
    caption: "Late night studio vibes 🎵🔥 Working on some deep house tracks that'll make you move. Music is the universal language that connects all souls. Preview dropping tomorrow! 🎧 #music #producer #studio #deephouse #musicproduction #latenight",
    authorId: "user_9",
    authorUsername: "music_vibes",
    authorImageUrl: "https://i.pravatar.cc/300?img=9",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    caption: "Perfect waves at Malibu today! 🌊🏄‍♀️ The ocean called and I answered. Three hours of pure bliss riding these beautiful barrels. Salt water therapy is the best therapy 💙 #surfing #malibu #ocean #waves #surferlife #saltwater",
    authorId: "user_2",
    authorUsername: "sarah_travels",
    authorImageUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 10,
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
    caption: "Omakase dinner at Tanaka-san's! 🍣✨ 16 courses of pure artistry. Each piece tells a story of tradition, technique, and perfection. This tuna belly just melted in my mouth 🤤 #sushi #omakase #japanese #foodart #culinary #perfection",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 11,
    imageUrl: "https://images.unsplash.com/photo-1558618047-d7df20d1aeda?w=800",
    caption: "Summit conquered! ⛰️🎯 12 hours of climbing but this view from 14,000 feet makes every step worth it. Pushing limits and finding strength I didn't know I had 💪 #mountaineering #summit #adventure #climbing #strength #motivation",
    authorId: "user_1",
    authorUsername: "alex_photographer",
    authorImageUrl: "https://i.pravatar.cc/300?img=1",
    createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(), // 3.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 12,
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800",
    caption: "New gallery piece unveiled! 🖼️✨ Six months of work culminating in this moment. Art isn't just about the final piece, it's about the journey of discovery 🎨 Opening night was magical! #gallery #art #exhibition #contemporary #artistlife #unveiling",
    authorId: "user_6",
    authorUsername: "creative_soul",
    authorImageUrl: "https://i.pravatar.cc/300?img=6",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 13,
    imageUrl: "https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=800",
    caption: "Rainbow breakfast bowl! 🌈🥣 Acai, fresh berries, granola, and coconut flakes. Fueling my body with nature's candy before today's workout. What's your favorite healthy breakfast? 💚 #healthy #breakfast #acai #nutrition #wellness #colorful",
    authorId: "user_7",
    authorUsername: "fitness_guru",
    authorImageUrl: "https://i.pravatar.cc/300?img=7",
    createdAt: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(), // 4.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 14,
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    caption: "Street art discovery in the heart of Brooklyn! 🎨🏙️ Found this incredible mural during my morning walk. Cities are open galleries if you know where to look. The stories these walls tell... 📖 #streetart #brooklyn #mural #urban #art #discovery",
    authorId: "user_3",
    authorUsername: "urban_artist",
    authorImageUrl: "https://i.pravatar.cc/300?img=3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 15,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    caption: "Cozy Sunday reading nook ☕📚 Currently diving into 'The Seven Husbands of Evelyn Hugo' and completely obsessed! Tea, blankets, and a good book - perfect Sunday vibes ✨ What are you reading? #books #reading #sunday #cozy #bookstagram #tea",
    authorId: "user_13",
    authorUsername: "book_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=13",
    createdAt: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(), // 5.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 16,
    imageUrl: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800",
    caption: "Live at Red Rocks! 🎸🔥 The energy tonight was absolutely electric. 15,000 people moving as one to the rhythm. This is why I create music - to connect souls through sound 🎵 #livemusic #redrocks #concert #energy #music #connection",
    authorId: "user_9",
    authorUsername: "music_vibes",
    authorImageUrl: "https://i.pravatar.cc/300?img=9",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 17,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    caption: "Forest meditation session 🧘‍♀️🌲 Found perfect silence among these ancient redwoods. Two hours of pure mindfulness and inner peace. Nature is the greatest teacher of presence 🙏 #meditation #forest #mindfulness #nature #peace #redwoods",
    authorId: "user_11",
    authorUsername: "yoga_flow",
    authorImageUrl: "https://i.pravatar.cc/300?img=11",
    createdAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(), // 6.5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 18,
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    caption: "Throwback to Santorini sunsets! 🌅💙 Missing those blue domes and endless ocean views. Already planning my next Greek island adventure. Who wants to join? ✈️ #santorini #greece #sunset #travel #wanderlust #memories #islands",
    authorId: "user_2",
    authorUsername: "sarah_travels",
    authorImageUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date().toISOString(),
  },
];

// Generate random like and comment counts
const getRandomEngagement = () => ({
  likes: Math.floor(Math.random() * 2000) + 10,
  comments: Math.floor(Math.random() * 100) + 1,
});

export default function HomePage() {
  const backend = useBackend();
  const [displayedPosts, setDisplayedPosts] = useState(mockPosts.slice(0, 6));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: () => backend.posts.getFeed({}),
    enabled: false, // Disable auto-fetch to show mock data instantly
  });

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoadingMore) {
        return;
      }
      loadMorePosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore]);

  const loadMorePosts = () => {
    if (displayedPosts.length >= mockPosts.length) {
      setHasMore(false);
      return;
    }

    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPosts = mockPosts.slice(displayedPosts.length, displayedPosts.length + 3);
      setDisplayedPosts(prev => [...prev, ...nextPosts]);
      setIsLoadingMore(false);
      
      if (displayedPosts.length + nextPosts.length >= mockPosts.length) {
        setHasMore(false);
      }
    }, 1000);
  };

  const loadRealData = () => {
    // Trigger real data fetch
    backend.posts.getFeed({}).then(data => {
      if (data?.posts) {
        setDisplayedPosts(data.posts);
      }
    }).catch(console.error);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Demo banner */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles size={20} className="text-purple-400" />
            <span className="text-white text-sm">Demo feed with mock data</span>
          </div>
          <Button
            onClick={loadRealData}
            size="sm"
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 rounded-xl"
          >
            <RefreshCw size={16} className="mr-2" />
            Load Real Data
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {displayedPosts.map((post, index) => {
          const engagement = getRandomEngagement();
          return (
            <PostCard 
              key={post.id} 
              post={post} 
              initialLikes={engagement.likes}
              initialComments={engagement.comments}
            />
          );
        })}
      </div>

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-400">
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading more posts...</span>
          </div>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <Sparkles size={32} className="text-purple-400 mx-auto mb-2" />
            <p className="text-gray-300">You're all caught up! ✨</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new posts</p>
          </div>
        </div>
      )}

      {/* Empty state (if no posts) */}
      {displayedPosts.length === 0 && !isLoading && (
        <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <Camera size={32} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles size={24} className="text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Aura! ✨</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your feed is waiting to be filled with amazing moments.<br />
            Follow some users to see their posts here, or explore to discover new content.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Connect with friends</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera size={16} />
              <span>Share your story</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
