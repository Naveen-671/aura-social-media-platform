import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Home, Search, PlusSquare, Heart, User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

export default function BottomNavigation() {
  const location = useLocation();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Explore" },
    { path: null, icon: PlusSquare, label: "Create", action: () => setShowCreateModal(true) },
    { path: "/reels", icon: Play, label: "Reels" },
    { path: "/notifications", icon: Heart, label: "Notifications" },
    { path: `/profile/${user?.id}`, icon: User, label: "Profile" }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl shadow-purple-500/10">
        <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const active = item.path ? isActive(item.path) : false;
            
            if (item.action) {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={item.action}
                  className="flex flex-col items-center justify-center p-3 h-auto rounded-2xl transition-all duration-300 hover:bg-gray-800/70 hover:scale-105 group"
                >
                  <div className="relative">
                    <IconComponent 
                      size={24} 
                      className="text-gray-400 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                  </div>
                  <span className="text-xs mt-1 text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                    {item.label}
                  </span>
                </Button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path!}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-800/70 hover:scale-105 group ${
                  active ? "bg-purple-500/20 scale-105" : ""
                }`}
              >
                <div className="relative">
                  <IconComponent 
                    size={24} 
                    className={`transition-all duration-300 group-hover:scale-110 ${
                      active ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"
                    }`}
                  />
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-30 blur-xl"></div>
                  )}
                </div>
                <span className={`text-xs mt-1 transition-colors duration-300 ${
                  active ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"
                }`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
