import { api } from "encore.dev/api";
import { postsDB } from "./db";

interface FakePost {
  imageUrl: string;
  caption: string;
  authorId: string;
}

// Creates fake posts for demo purposes.
export const createFakePosts = api<void, { message: string; count: number }>(
  { expose: true, method: "POST", path: "/posts/create-fake" },
  async () => {
    const fakeUsers = [
      { id: "user_1", username: "alex_photographer", imageUrl: "https://i.pravatar.cc/300?img=1", bio: "📸 Capturing life's beautiful moments • Travel & Portrait Photography • 📍 NYC" },
      { id: "user_2", username: "sarah_travels", imageUrl: "https://i.pravatar.cc/300?img=2", bio: "✈️ Digital nomad exploring the world • 🌍 50+ countries visited • Travel blogger" },
      { id: "user_3", username: "urban_artist", imageUrl: "https://i.pravatar.cc/300?img=3", bio: "🎨 Street art enthusiast • Mural painter • 🏙️ Making cities more colorful" },
      { id: "user_4", username: "food_explorer", imageUrl: "https://i.pravatar.cc/300?img=4", bio: "🍴 Food blogger & chef • Michelin star hunter • Recipe creator extraordinaire" },
      { id: "user_5", username: "nature_lover", imageUrl: "https://i.pravatar.cc/300?img=5", bio: "🌲 National parks enthusiast • Wildlife photographer • Conservation advocate" },
      { id: "user_6", username: "creative_soul", imageUrl: "https://i.pravatar.cc/300?img=6", bio: "💡 Creative director & designer • Making the world more beautiful, one pixel at a time" },
      { id: "user_7", username: "fitness_guru", imageUrl: "https://i.pravatar.cc/300?img=7", bio: "💪 Personal trainer • Wellness coach • Helping you become your strongest self" },
      { id: "user_8", username: "tech_wanderer", imageUrl: "https://i.pravatar.cc/300?img=8", bio: "👨‍💻 Software engineer • Tech reviewer • Building the future with code" },
      { id: "user_9", username: "music_vibes", imageUrl: "https://i.pravatar.cc/300?img=9", bio: "🎵 Music producer • DJ • Creating beats that move souls" },
      { id: "user_10", username: "art_enthusiast", imageUrl: "https://i.pravatar.cc/300?img=10", bio: "🖼️ Art collector • Gallery curator • Passionate about contemporary art" },
      { id: "user_11", username: "yoga_flow", imageUrl: "https://i.pravatar.cc/300?img=11", bio: "🧘‍♀️ Yoga instructor • Mindfulness coach • Finding balance in life" },
      { id: "user_12", username: "ocean_explorer", imageUrl: "https://i.pravatar.cc/300?img=12", bio: "🌊 Marine biologist • Scuba diving instructor • Ocean conservation warrior" },
      { id: "user_13", username: "book_lover", imageUrl: "https://i.pravatar.cc/300?img=13", bio: "📚 Bookworm • Literary critic • Reading 100 books a year challenge" },
      { id: "user_14", username: "coffee_addict", imageUrl: "https://i.pravatar.cc/300?img=14", bio: "☕ Coffee connoisseur • Barista • Exploring the world one cup at a time" },
      { id: "user_15", username: "minimalist_life", imageUrl: "https://i.pravatar.cc/300?img=15", bio: "✨ Minimalist lifestyle • Sustainable living advocate • Less is more philosophy" },
    ];

    // First, create fake users
    for (const user of fakeUsers) {
      await postsDB.exec`
        INSERT INTO users (id, username, image_url, bio)
        VALUES (${user.id}, ${user.username}, ${user.imageUrl}, ${user.bio})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    const fakePosts: FakePost[] = [
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Golden hour magic at the mountains! 🌄✨ Nothing beats this view after a 6-hour hike. The journey was tough but moments like these make it all worth it 💫 #mountainlife #goldenhour #hiking #naturephotography #adventure",
        authorId: "user_1",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1551334787-21e682472b24?w=800",
        caption: "Coffee and code - the perfect morning combination ☕️💻 Starting the day with some React development and my favorite Ethiopian blend. What's your go-to morning ritual? #coding #coffee #developer #morningvibes #productivity",
        authorId: "user_8",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
        caption: "Homemade pasta carbonara night! 🍝✨ Fresh eggs from the farmer's market, aged parmesan, and handmade linguine. Cooking from scratch is pure therapy 👨‍🍳 Recipe in my stories! #homecooking #pasta #italianfood #foodie #cooking",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        caption: "5AM sunrise run complete! 🏃‍♂️🌅 10K done and feeling absolutely amazing. There's something magical about having the streets to yourself while the world wakes up. Who else is part of the early bird fitness club? 💪 #running #fitness #sunrise #motivation #earlybird",
        authorId: "user_7",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
        caption: "Lost myself in this enchanted forest today 🌲🍃 Sometimes you need to disconnect from the digital world to reconnect with nature. Three hours of pure peace and mindfulness 🧘‍♀️ #forest #nature #mindfulness #hiking #digitaldetox #peace",
        authorId: "user_5",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800",
        caption: "New abstract piece finished! 🎨✨ Spent 3 weeks exploring color theory and texture. Art is my language when words aren't enough. This one speaks to me about chaos finding harmony 🌈 #abstract #art #painting #creativity #colors #artistlife",
        authorId: "user_10",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
        caption: "Urban symphony at golden hour 🏙️✨ The way light dances between these skyscrapers never gets old. Every day the city shows me a new face, a new story to capture 📸 #urbarphotography #citylife #goldenhour #architecture #streetphotography",
        authorId: "user_3",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800",
        caption: "Late night studio vibes 🎵🔥 Working on some deep house tracks that'll make you move. Music is the universal language that connects all souls. Preview dropping tomorrow! 🎧 #music #producer #studio #deephouse #musicproduction #latenight",
        authorId: "user_9",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        caption: "Perfect waves at Malibu today! 🌊🏄‍♀️ The ocean called and I answered. Three hours of pure bliss riding these beautiful barrels. Salt water therapy is the best therapy 💙 #surfing #malibu #ocean #waves #surferlife #saltwater",
        authorId: "user_2",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
        caption: "Omakase dinner at Tanaka-san's! 🍣✨ 16 courses of pure artistry. Each piece tells a story of tradition, technique, and perfection. This tuna belly just melted in my mouth 🤤 #sushi #omakase #japanese #foodart #culinary #perfection",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1558618047-d7df20d1aeda?w=800",
        caption: "Summit conquered! ⛰️🎯 12 hours of climbing but this view from 14,000 feet makes every step worth it. Pushing limits and finding strength I didn't know I had 💪 #mountaineering #summit #adventure #climbing #strength #motivation",
        authorId: "user_1",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800",
        caption: "New gallery piece unveiled! 🖼️✨ Six months of work culminating in this moment. Art isn't just about the final piece, it's about the journey of discovery 🎨 Opening night was magical! #gallery #art #exhibition #contemporary #artistlife #unveiling",
        authorId: "user_6",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=800",
        caption: "Rainbow breakfast bowl! 🌈🥣 Acai, fresh berries, granola, and coconut flakes. Fueling my body with nature's candy before today's workout. What's your favorite healthy breakfast? 💚 #healthy #breakfast #acai #nutrition #wellness #colorful",
        authorId: "user_7",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        caption: "Street art discovery in the heart of Brooklyn! 🎨🏙️ Found this incredible mural during my morning walk. Cities are open galleries if you know where to look. The stories these walls tell... 📖 #streetart #brooklyn #mural #urban #art #discovery",
        authorId: "user_3",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        caption: "Cozy Sunday reading nook ☕📚 Currently diving into 'The Seven Husbands of Evelyn Hugo' and completely obsessed! Tea, blankets, and a good book - perfect Sunday vibes ✨ What are you reading? #books #reading #sunday #cozy #bookstagram #tea",
        authorId: "user_13",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800",
        caption: "Live at Red Rocks! 🎸🔥 The energy tonight was absolutely electric. 15,000 people moving as one to the rhythm. This is why I create music - to connect souls through sound 🎵 #livemusic #redrocks #concert #energy #music #connection",
        authorId: "user_9",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        caption: "Forest meditation session 🧘‍♀️🌲 Found perfect silence among these ancient redwoods. Two hours of pure mindfulness and inner peace. Nature is the greatest teacher of presence 🙏 #meditation #forest #mindfulness #nature #peace #redwoods",
        authorId: "user_11",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        caption: "Throwback to Santorini sunsets! 🌅💙 Missing those blue domes and endless ocean views. Already planning my next Greek island adventure. Who wants to join? ✈️ #santorini #greece #sunset #travel #wanderlust #memories #islands",
        authorId: "user_2",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
        caption: "Farmers market haul! 🥕🌶️ Supporting local vendors and getting the freshest ingredients for tonight's farm-to-table dinner. Community and sustainability go hand in hand 🌱 #farmersmarket #local #organic #sustainable #community #fresh",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800",
        caption: "Perfect espresso shot! ☕✨ Single origin Ethiopian beans, 25-second extraction, perfect crema. The art of coffee is all about precision and passion ❤️ #coffee #espresso #barista #coffeeart #precision #passion #specialty",
        authorId: "user_14",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800",
        caption: "Sunset yoga flow on the beach 🧘‍♀️🌅 Connecting breath with movement as the day transitions to night. These moments of pure presence are everything 🙏 #yoga #sunset #beach #flow #mindfulness #presence #peace",
        authorId: "user_11",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
        caption: "Minimalist workspace vibes ✨💻 Less clutter, more focus. Clean space, clear mind. Sometimes the most productive setup is the simplest one 🤍 #minimalist #workspace #clean #focus #productivity #simple #design",
        authorId: "user_15",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        caption: "Coral reef diving adventure! 🐠🌊 Explored this underwater paradise for 45 minutes. The biodiversity here is absolutely incredible. Every dive reminds me why we must protect our oceans 💙 #scubadiving #coral #ocean #marine #conservation #underwater",
        authorId: "user_12",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
        caption: "New beat dropping tonight! 🎵🔥 Been working on this electronic symphony for months. It's got that perfect blend of ambient and energy that'll move your soul 🎧 Link in bio! #music #electronic #newrelease #producer #beats #ambient",
        authorId: "user_9",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1502780402662-acc01917424e?w=800",
        caption: "Alpine lake reflection 🏔️💎 Hiked 8 miles to find this hidden gem. The silence here is deafening, the beauty overwhelming. Nature's mirrors are the most honest 🪞 #alpine #lake #hiking #reflection #mountains #nature #hidden",
        authorId: "user_5",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800",
        caption: "Fresh sourdough success! 🍞✨ Three days of feeding my starter paid off. That perfect crust and airy crumb - pure bread bliss. Nothing beats the smell of fresh baked bread 👨‍🍳 #sourdough #bread #baking #homemade #fermentation #crust",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        caption: "Tropical paradise found! 🏝️🌺 Crystal clear waters and powder white sand. Sometimes you need to escape to paradise to remember what life's about. Pure bliss mode activated 🏖️ #tropical #paradise #beach #vacation #bliss #crystalclear #escape",
        authorId: "user_2",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        caption: "Morning strength training complete! 💪🔥 Deadlifts, squats, and pure determination. Your body can handle almost anything - it's your mind you need to convince 🧠 #strength #training #fitness #deadlifts #determination #mindset #strong",
        authorId: "user_7",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
        caption: "Contemporary art exhibition opening! 🎨✨ Honored to showcase my latest collection exploring human connection in digital age. Art should make you feel, think, and question 🤔 #contemporary #art #exhibition #digital #connection #human #opening",
        authorId: "user_10",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
        caption: "Wilderness camping under the stars ⭐🏕️ No cell service, no distractions, just me and the cosmos. Sometimes you need to get lost to find yourself 🌌 #camping #stars #wilderness #cosmos #solitude #peace #disconnect",
        authorId: "user_5",
      },
    ];

    let createdCount = 0;
    for (const post of fakePosts) {
      await postsDB.exec`
        INSERT INTO posts (image_url, caption, author_id)
        VALUES (${post.imageUrl}, ${post.caption}, ${post.authorId})
      `;
      createdCount++;
    }

    return {
      message: "Fake posts created successfully!",
      count: createdCount,
    };
  }
);
