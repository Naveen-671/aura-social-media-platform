import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Home, Search, PlusSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Aura
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              to="/explore"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/explore") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Search size={20} />
              <span>Explore</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <PlusSquare size={20} />
              <span>Create</span>
            </Button>

            <Link
              to={`/profile/${user?.id}`}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname.startsWith("/profile") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/"
              className={`p-3 rounded-lg ${
                isActive("/") ? "text-gray-900" : "text-gray-600"
              }`}
            >
              <Home size={24} />
            </Link>
            <Link
              to="/explore"
              className={`p-3 rounded-lg ${
                isActive("/explore") ? "text-gray-900" : "text-gray-600"
              }`}
            >
              <Search size={24} />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="p-3"
            >
              <PlusSquare size={24} />
            </Button>
            <Link
              to={`/profile/${user?.id}`}
              className={`p-3 rounded-lg ${
                location.pathname.startsWith("/profile") ? "text-gray-900" : "text-gray-600"
              }`}
            >
              <User size={24} />
            </Link>
          </div>
        </div>
      </header>

      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
