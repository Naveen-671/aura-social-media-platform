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
      { id: "user_1", username: "alex_photographer" },
      { id: "user_2", username: "sarah_travels" },
      { id: "user_3", username: "urban_artist" },
      { id: "user_4", username: "food_explorer" },
      { id: "user_5", username: "nature_lover" },
      { id: "user_6", username: "creative_soul" },
      { id: "user_7", username: "fitness_guru" },
      { id: "user_8", username: "tech_wanderer" },
      { id: "user_9", username: "music_vibes" },
      { id: "user_10", username: "art_enthusiast" },
    ];

    // First, create fake users
    for (const user of fakeUsers) {
      await postsDB.exec`
        INSERT INTO users (id, username, image_url, bio)
        VALUES (${user.id}, ${user.username}, ${"https://i.pravatar.cc/300?img=" + (fakeUsers.indexOf(user) + 1)}, ${"Passionate about sharing moments and creating memories ✨"})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    const fakePosts: FakePost[] = [
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Caught the perfect sunset at the mountains today! 🌄 Nature never fails to amaze me. #photography #sunset #mountains",
        authorId: "user_1",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1551334787-21e682472b24?w=800",
        caption: "Coffee and code - the perfect combination for a productive morning ☕️💻 #coding #coffee #productivity",
        authorId: "user_8",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
        caption: "Homemade pasta night! 🍝 Nothing beats the satisfaction of cooking from scratch. Recipe in comments! #cooking #pasta #homemade",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        caption: "Morning workout complete! 💪 Started my day with a 5km run and feeling amazing. Who else is crushing their fitness goals today? #fitness #running #motivation",
        authorId: "user_7",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
        caption: "Lost in the beauty of this forest trail 🌲 Sometimes you need to disconnect to reconnect with nature. #hiking #nature #forest",
        authorId: "user_5",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800",
        caption: "Abstract art in progress! 🎨 Playing with colors and textures today. Art is my therapy. #art #abstract #creativity",
        authorId: "user_10",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
        caption: "Golden hour in the city 🌅 The way light hits these buildings is pure magic. Urban photography at its finest! #urbanphotography #goldenhour #city",
        authorId: "user_3",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800",
        caption: "Late night studio session 🎵 Working on some new beats. Music is the universal language that connects us all. #music #studio #beats",
        authorId: "user_9",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        caption: "Beach vibes and ocean waves 🌊 Perfect day for some surf photography. The ocean is calling and I must go! #beach #surf #ocean",
        authorId: "user_2",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
        caption: "Fresh sushi night! 🍣 There's something magical about the precision and artistry of Japanese cuisine. #sushi #japanese #food",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1558618047-d7df20d1aeda?w=800",
        caption: "Mountain peak conquered! ⛰️ 8 hours of hiking but so worth it for this incredible view. Challenge yourself and grow! #hiking #mountains #adventure",
        authorId: "user_1",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800",
        caption: "New artwork finished! 🖼️ Spent weeks on this piece and I'm finally happy with the result. Art takes time and patience. #art #painting #creative",
        authorId: "user_6",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?w=800",
        caption: "Healthy breakfast bowl 🥣 Starting the day right with fresh fruits, granola, and yogurt. Fuel your body, fuel your dreams! #healthy #breakfast #nutrition",
        authorId: "user_7",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Street art discovery! 🎨 Found this amazing mural during my morning walk. Cities are open-air galleries if you know where to look. #streetart #urban #mural",
        authorId: "user_3",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        caption: "Cozy reading corner 📚 Perfect spot for diving into a good book with some tea. What's everyone reading lately? #reading #books #cozy",
        authorId: "user_6",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Drone photography experiment! 🚁 Getting new perspectives from above. Technology opens up so many creative possibilities. #drone #photography #perspective",
        authorId: "user_8",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
        caption: "Farmers market haul! 🥕 Supporting local vendors and getting the freshest ingredients. Community and sustainability matter! #farmersmarket #local #sustainable",
        authorId: "user_4",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800",
        caption: "Live music energy! 🎸 Nothing compares to the feeling of performing for a crowd. Music brings people together. #livemusic #performance #energy",
        authorId: "user_9",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        caption: "Forest meditation 🧘‍♀️ Finding peace among the trees. Nature is the best therapist you could ask for. #meditation #nature #peace",
        authorId: "user_5",
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        caption: "Travel memories 🌍 Looking through old photos and missing all the amazing places I've been. Can't wait for the next adventure! #travel #memories #wanderlust",
        authorId: "user_2",
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
