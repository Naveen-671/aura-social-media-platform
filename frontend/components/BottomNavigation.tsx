import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
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
    { path: "/notifications", icon: Heart, label: "Notifications" },
    { path: `/profile/${user?.id}`, icon: User, label: "Profile" }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <div className="flex items-center justify-around py-2 px-4">
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
                  className="flex flex-col items-center justify-center p-3 h-auto rounded-xl transition-all duration-200 hover:bg-gray-800/50"
                >
                  <IconComponent 
                    size={24} 
                    className={`${active ? "text-purple-400" : "text-gray-400"} transition-colors duration-200`}
                  />
                  <span className={`text-xs mt-1 ${active ? "text-purple-400" : "text-gray-400"}`}>
                    {item.label}
                  </span>
                </Button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path!}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 hover:bg-gray-800/50 ${
                  active ? "bg-purple-500/20" : ""
                }`}
              >
                <IconComponent 
                  size={24} 
                  className={`${active ? "text-purple-400" : "text-gray-400"} transition-colors duration-200`}
                />
                <span className={`text-xs mt-1 ${active ? "text-purple-400" : "text-gray-400"}`}>
                  {item.label}
                </span>
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
