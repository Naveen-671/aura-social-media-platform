import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useBackend } from "../hooks/useBackend";
import BottomNavigation from "./BottomNavigation";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import ProfilePage from "../pages/ProfilePage";
import PostPage from "../pages/PostPage";
import NotificationsPage from "../pages/NotificationsPage";
import ReelsPage from "../pages/ReelsPage";

export default function AppInner() {
  const { user } = useUser();
  const backend = useBackend();

  useEffect(() => {
    if (user) {
      // Sync user data with backend
      backend.users.syncUser({
        id: user.id,
        username: user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "user",
        imageUrl: user.imageUrl,
      }).catch(console.error);
    }
  }, [user, backend]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}
