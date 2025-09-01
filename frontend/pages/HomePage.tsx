import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import { useBackend } from "../hooks/useBackend";
import { Camera, Users, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Enhanced mock data with more diverse content
const mockPosts = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    caption: "Golden hour magic at the mountains! 🌄✨ Nothing beats this view after a 6-hour hike. The journey was tough but moments like these make it all worth it 💫 #mountainlife #goldenhour #hiking #naturephotography #adventure #sunset #peaceful #mindfulness",
    authorId: "user_1",
    authorUsername: "alex_photographer",
    authorImageUrl: "https://i.pravatar.cc/300?img=1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1551334787-21e682472b24?w=800",
    caption: "Coffee and code - the perfect morning combination ☕️💻 Starting the day with some React development and my favorite Ethiopian blend. What's your go-to morning ritual? Drop it in the comments! #coding #coffee #developer #morningvibes #productivity #react #javascript #caffeinated",
    authorId: "user_8",
    authorUsername: "tech_wanderer",
    authorImageUrl: "https://i.pravatar.cc/300?img=8",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
    caption: "Homemade pasta carbonara night! 🍝✨ Fresh eggs from the farmer's market, aged parmesan, and handmade linguine. Cooking from scratch is pure therapy 👨‍🍳 Recipe in my stories! Who wants the full tutorial? #homecooking #pasta #italianfood #foodie #cooking #fresh #therapy #delicious",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    caption: "5AM sunrise run complete! 🏃‍♂️🌅 10K done and feeling absolutely amazing. There's something magical about having the streets to yourself while the world wakes up. Who else is part of the early bird fitness club? Let's motivate each other! 💪 #running #fitness #sunrise #motivation #earlybird #health #wellness #endorphins",
    authorId: "user_7",
    authorUsername: "fitness_guru",
    authorImageUrl: "https://i.pravatar.cc/300?img=7",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
    caption: "Lost myself in this enchanted forest today 🌲🍃 Sometimes you need to disconnect from the digital world to reconnect with nature. Three hours of pure peace and mindfulness. No notifications, just bird songs and rustling leaves 🧘‍♀️ #forest #nature #mindfulness #hiking #digitaldetox #peace #meditation #earthing",
    authorId: "user_5",
    authorUsername: "nature_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=5",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800",
    caption: "New abstract piece finished! 🎨✨ Spent 3 weeks exploring color theory and texture. Art is my language when words aren't enough. This one speaks to me about chaos finding harmony. What emotions does it evoke for you? 🌈 #abstract #art #painting #creativity #colors #artistlife #expression #emotional",
    authorId: "user_10",
    authorUsername: "art_enthusiast",
    authorImageUrl: "https://i.pravatar.cc/300?img=10",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    caption: "Urban symphony at golden hour 🏙️✨ The way light dances between these skyscrapers never gets old. Every day the city shows me a new face, a new story to capture. Architecture is frozen music 📸 #urbarphotography #citylife #goldenhour #architecture #streetphotography #light #shadows #metropolitan",
    authorId: "user_3",
    authorUsername: "urban_artist",
    authorImageUrl: "https://i.pravatar.cc/300?img=3",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800",
    caption: "Late night studio vibes 🎵🔥 Working on some deep house tracks that'll make you move. Music is the universal language that connects all souls. Preview dropping tomorrow on SoundCloud! Who's ready to dance? 🎧 #music #producer #studio #deephouse #musicproduction #latenight #vibes #dance",
    authorId: "user_9",
    authorUsername: "music_vibes",
    authorImageUrl: "https://i.pravatar.cc/300?img=9",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    caption: "Perfect waves at Malibu today! 🌊🏄‍♀️ The ocean called and I answered. Three hours of pure bliss riding these beautiful barrels. Salt water therapy is the best therapy. Who wants to join me for dawn patrol tomorrow? 💙 #surfing #malibu #ocean #waves #surferlife #saltwater #therapy #stoked",
    authorId: "user_2",
    authorUsername: "sarah_travels",
    authorImageUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 10,
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
    caption: "Omakase dinner at Tanaka-san's! 🍣✨ 16 courses of pure artistry. Each piece tells a story of tradition, technique, and perfection. This tuna belly just melted in my mouth like butter 🤤 If you love sushi, this place is a must-visit! #sushi #omakase #japanese #foodart #culinary #perfection #traditional #experience",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 11,
    imageUrl: "https://images.unsplash.com/photo-1558618047-d7df20d1aeda?w=800",
    caption: "Summit conquered! ⛰️🎯 12 hours of climbing but this view from 14,000 feet makes every step worth it. Pushing limits and finding strength I didn't know I had. The mountains teach you about yourself 💪 #mountaineering #summit #adventure #climbing #strength #motivation #altitude #overcome",
    authorId: "user_1",
    authorUsername: "alex_photographer",
    authorImageUrl: "https://i.pravatar.cc/300?img=1",
    createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 12,
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800",
    caption: "New gallery piece unveiled! 🖼️✨ Six months of work culminating in this moment. Art isn't just about the final piece, it's about the journey of discovery, the late nights, the doubts, and the breakthroughs. Opening night was absolutely magical! #gallery #art #exhibition #contemporary #artistlife #unveiling #journey #breakthrough",
    authorId: "user_6",
    authorUsername: "creative_soul",
    authorImageUrl: "https://i.pravatar.cc/300?img=6",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 13,
    imageUrl: "https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=800",
    caption: "Rainbow breakfast bowl! 🌈🥣 Acai, fresh berries, granola, and coconut flakes. Fueling my body with nature's candy before today's HIIT workout. What's your favorite healthy breakfast? Share your morning fuel below! 💚 #healthy #breakfast #acai #nutrition #wellness #colorful #energy #fuel",
    authorId: "user_7",
    authorUsername: "fitness_guru",
    authorImageUrl: "https://i.pravatar.cc/300?img=7",
    createdAt: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 14,
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    caption: "Street art discovery in the heart of Brooklyn! 🎨🏙️ Found this incredible mural during my morning walk. Cities are open galleries if you know where to look. The stories these walls tell are powerful and raw 📖 #streetart #brooklyn #mural #urban #art #discovery #culture #stories",
    authorId: "user_3",
    authorUsername: "urban_artist",
    authorImageUrl: "https://i.pravatar.cc/300?img=3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 15,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    caption: "Cozy Sunday reading nook ☕📚 Currently diving into 'The Seven Husbands of Evelyn Hugo' and completely obsessed! Tea, blankets, and a good book - perfect Sunday vibes. What are you reading this week? Drop your recommendations! ✨ #books #reading #sunday #cozy #bookstagram #tea #recommendations #literature",
    authorId: "user_13",
    authorUsername: "book_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=13",
    createdAt: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 16,
    imageUrl: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800",
    caption: "Live at Red Rocks! 🎸🔥 The energy tonight was absolutely electric. 15,000 people moving as one to the rhythm. This is why I create music - to connect souls through sound. What an incredible venue under the stars! 🎵 #livemusic #redrocks #concert #energy #music #connection #stars #electric",
    authorId: "user_9",
    authorUsername: "music_vibes",
    authorImageUrl: "https://i.pravatar.cc/300?img=9",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 17,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    caption: "Forest meditation session 🧘‍♀️🌲 Found perfect silence among these ancient redwoods. Two hours of pure mindfulness and inner peace. Nature is the greatest teacher of presence and patience 🙏 #meditation #forest #mindfulness #nature #peace #redwoods #ancient #presence",
    authorId: "user_11",
    authorUsername: "yoga_flow",
    authorImageUrl: "https://i.pravatar.cc/300?img=11",
    createdAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 18,
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    caption: "Throwback to Santorini sunsets! 🌅💙 Missing those blue domes and endless ocean views. Already planning my next Greek island adventure. Who wants to join me for Mykonos in the spring? ✈️ #santorini #greece #sunset #travel #wanderlust #memories #islands #mediterranean",
    authorId: "user_2",
    authorUsername: "sarah_travels",
    authorImageUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 19,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    caption: "Farmers market haul! 🥕🌶️ Supporting local vendors and getting the freshest ingredients for tonight's farm-to-table dinner. Community and sustainability go hand in hand. Nothing beats the taste of local produce! 🌱 #farmersmarket #local #organic #sustainable #community #fresh #farmtotable #local",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 7.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 20,
    imageUrl: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800",
    caption: "Perfect espresso shot! ☕✨ Single origin Ethiopian beans, 25-second extraction, perfect crema. The art of coffee is all about precision, patience, and passion. Every cup tells a story ❤️ #coffee #espresso #barista #coffeeart #precision #passion #specialty #craft",
    authorId: "user_14",
    authorUsername: "coffee_addict",
    authorImageUrl: "https://i.pravatar.cc/300?img=14",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 21,
    imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800",
    caption: "Sunset yoga flow on the beach 🧘‍♀️🌅 Connecting breath with movement as the day transitions to night. These moments of pure presence are everything. Join me for beach yoga tomorrow at 6 PM! 🙏 #yoga #sunset #beach #flow #mindfulness #presence #peace #community",
    authorId: "user_11",
    authorUsername: "yoga_flow",
    authorImageUrl: "https://i.pravatar.cc/300?img=11",
    createdAt: new Date(Date.now() - 8.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 22,
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
    caption: "Minimalist workspace vibes ✨💻 Less clutter, more focus. Clean space, clear mind. Sometimes the most productive setup is the simplest one. What does your workspace look like? 🤍 #minimalist #workspace #clean #focus #productivity #simple #design #clarity",
    authorId: "user_15",
    authorUsername: "minimalist_life",
    authorImageUrl: "https://i.pravatar.cc/300?img=15",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 23,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    caption: "Coral reef diving adventure! 🐠🌊 Explored this underwater paradise for 45 minutes. The biodiversity here is absolutely incredible. Every dive reminds me why we must protect our oceans 💙 #scubadiving #coral #ocean #marine #conservation #underwater #biodiversity #protection",
    authorId: "user_12",
    authorUsername: "ocean_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=12",
    createdAt: new Date(Date.now() - 9.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 24,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    caption: "New beat dropping tonight! 🎵🔥 Been working on this electronic symphony for months. It's got that perfect blend of ambient and energy that'll move your soul. Pre-save link in bio! 🎧 #music #electronic #newrelease #producer #beats #ambient #symphony #presave",
    authorId: "user_9",
    authorUsername: "music_vibes",
    authorImageUrl: "https://i.pravatar.cc/300?img=9",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 25,
    imageUrl: "https://images.unsplash.com/photo-1502780402662-acc01917424e?w=800",
    caption: "Alpine lake reflection 🏔️💎 Hiked 8 miles to find this hidden gem. The silence here is deafening, the beauty overwhelming. Nature's mirrors are the most honest reflections of our souls 🪞 #alpine #lake #hiking #reflection #mountains #nature #hidden #soul",
    authorId: "user_5",
    authorUsername: "nature_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=5",
    createdAt: new Date(Date.now() - 10.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 26,
    imageUrl: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800",
    caption: "Fresh sourdough success! 🍞✨ Three days of feeding my starter paid off beautifully. That perfect crust and airy crumb - pure bread bliss. Nothing beats the smell of fresh baked bread filling the house 👨‍🍳 #sourdough #bread #baking #homemade #fermentation #crust #artisan #tradition",
    authorId: "user_4",
    authorUsername: "food_explorer",
    authorImageUrl: "https://i.pravatar.cc/300?img=4",
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 27,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    caption: "Tropical paradise found! 🏝️🌺 Crystal clear waters and powder white sand. Sometimes you need to escape to paradise to remember what life's truly about. Pure bliss mode: activated 🏖️ #tropical #paradise #beach #vacation #bliss #crystalclear #escape #meditation",
    authorId: "user_2",
    authorUsername: "sarah_travels",
    authorImageUrl: "https://i.pravatar.cc/300?img=2",
    createdAt: new Date(Date.now() - 11.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 28,
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
    caption: "Contemporary art exhibition opening! 🎨✨ Honored to showcase my latest collection exploring human connection in the digital age. Art should make you feel, think, and question everything 🤔 #contemporary #art #exhibition #digital #connection #human #opening #thought",
    authorId: "user_10",
    authorUsername: "art_enthusiast",
    authorImageUrl: "https://i.pravatar.cc/300?img=10",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 29,
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
    caption: "Wilderness camping under the stars ⭐🏕️ No cell service, no distractions, just me and the infinite cosmos above. Sometimes you need to get completely lost to find yourself again 🌌 #camping #stars #wilderness #cosmos #solitude #peace #disconnect #infinite",
    authorId: "user_5",
    authorUsername: "nature_lover",
    authorImageUrl: "https://i.pravatar.cc/300?img=5",
    createdAt: new Date(Date.now() - 12.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 30,
    imageUrl: "https://images.unsplash.com/photo-1574455817193-b6ed4fb6c7d3?w=800",
    caption: "Morning crossfit session demolished! 🏋️‍♀️💥 Nothing like starting the day with some heavy lifts and metabolic conditioning. Your only competition is who you were yesterday. Let's get after it! 💪 #crossfit #strength #fitness #competition #progress #beast #dedication #grind",
    authorId: "user_7",
    authorUsername: "fitness_guru",
    authorImageUrl: "https://i.pravatar.cc/300?img=7",
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generate realistic engagement numbers
const getRandomEngagement = () => ({
  likes: Math.floor(Math.random() * 3000) + 50,
  comments: Math.floor(Math.random() * 150) + 5,
});

export default function HomePage() {
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [displayedPosts, setDisplayedPosts] = useState(mockPosts.slice(0, 8));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userCreatedPosts, setUserCreatedPosts] = useState<any[]>([]);

  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: () => backend.posts.getFeed({}),
    enabled: false, // Disable auto-fetch to show mock data instantly
  });

  // Query to get user's real posts
  const { data: realPostsData } = useQuery({
    queryKey: ["real-posts"],
    queryFn: () => backend.posts.listPosts({ limit: 50 }),
    onSuccess: (data) => {
      if (data?.posts) {
        setUserCreatedPosts(data.posts);
      }
    },
  });

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 && !isLoadingMore && hasMore) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, displayedPosts.length]);

  const loadMorePosts = () => {
    if (displayedPosts.length >= mockPosts.length) {
      setHasMore(false);
      return;
    }

    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPosts = mockPosts.slice(displayedPosts.length, Math.min(displayedPosts.length + 6, mockPosts.length));
      setDisplayedPosts(prev => [...prev, ...nextPosts]);
      setIsLoadingMore(false);
      
      if (displayedPosts.length + nextPosts.length >= mockPosts.length) {
        setHasMore(false);
      }
    }, 800);
  };

  const loadRealData = () => {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({ queryKey: ["real-posts"] });
    
    backend.posts.getFeed({}).then(data => {
      if (data?.posts && data.posts.length > 0) {
        // Mix real posts with mock posts for better experience
        const mixedPosts = [...data.posts, ...mockPosts.slice(0, 20)];
        setDisplayedPosts(mixedPosts.slice(0, 10));
        toast({
          title: "Feed updated! ✨",
          description: "Loaded real posts from the backend.",
        });
      } else {
        toast({
          title: "No real posts yet",
          description: "Create some posts first to see them in your feed!",
        });
      }
    }).catch((error) => {
      console.error("Failed to load real data:", error);
      toast({
        title: "Error loading feed",
        description: "Couldn't load real posts. Showing demo content.",
        variant: "destructive",
      });
    });
  };

  // Mutation for creating fake posts
  const createFakePostsMutation = useMutation({
    mutationFn: () => backend.posts.createFakePosts(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["real-posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast({
        title: "Demo posts created! 🎉",
        description: `${data.count} fake posts added to the database.`,
      });
      // Refresh the display
      loadRealData();
    },
    onError: (error) => {
      console.error("Failed to create fake posts:", error);
      toast({
        title: "Error",
        description: "Failed to create demo posts.",
        variant: "destructive",
      });
    },
  });

  // Combine user created posts with displayed posts
  const allPosts = [...userCreatedPosts, ...displayedPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Demo controls */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <Sparkles size={20} className="text-purple-400" />
            <span className="text-white text-sm">Enhanced feed with stories & reels</span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={loadRealData}
              size="sm"
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 rounded-xl text-xs"
            >
              <RefreshCw size={14} className="mr-2" />
              Load Real
            </Button>
            <Button
              onClick={() => createFakePostsMutation.mutate()}
              disabled={createFakePostsMutation.isPending}
              size="sm"
              variant="outline"
              className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 rounded-xl text-xs"
            >
              <Camera size={14} className="mr-2" />
              {createFakePostsMutation.isPending ? "Creating..." : "Add Demo Posts"}
            </Button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {allPosts.map((post, index) => {
          const engagement = getRandomEngagement();
          return (
            <PostCard 
              key={`${post.id}-${index}`}
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
      {!hasMore && allPosts.length > 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <Sparkles size={32} className="text-purple-400 mx-auto mb-2" />
            <p className="text-gray-300">You're all caught up! ✨</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new posts</p>
          </div>
        </div>
      )}

      {/* Empty state (if no posts) */}
      {allPosts.length === 0 && !isLoading && (
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
            Create your first post or explore to discover new content.
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
