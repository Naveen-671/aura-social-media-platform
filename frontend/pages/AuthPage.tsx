import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Camera } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 rotate-12">
                <Camera size={32} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles size={24} className="text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Aura
          </h1>
          <p className="text-gray-300 text-lg">Share your moments with the world</p>
          <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Join 10M+ users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles size={16} />
              <span>Create memories</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          {isSignUp ? (
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-300",
                  socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                  formFieldInput: "bg-gray-700 border-gray-600 text-white",
                  formButtonPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                  footerActionLink: "text-purple-400 hover:text-purple-300",
                },
              }}
            />
          ) : (
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-300",
                  socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                  formFieldInput: "bg-gray-700 border-gray-600 text-white",
                  formButtonPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                  footerActionLink: "text-purple-400 hover:text-purple-300",
                },
              }}
            />
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
