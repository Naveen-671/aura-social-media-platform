import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { clerkPublishableKey } from "./config";
import AuthPage from "./pages/AuthPage";
import AppInner from "./components/AppInner";

const queryClient = new QueryClient();

export default function App() {
  // Check if Clerk publishable key is properly configured
  if (!clerkPublishableKey || clerkPublishableKey.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md text-center p-8 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-gray-300 mb-4">
            Please set your Clerk publishable key as an environment variable.
          </p>
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <p className="text-sm font-mono text-gray-300">
              VITE_CLERK_PUBLISHABLE_KEY=your_key_here
            </p>
          </div>
          <p className="text-sm text-gray-400">
            You can get your publishable key from the{" "}
            <a 
              href="https://dashboard.clerk.com/last-active?path=api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 underline hover:text-purple-300"
            >
              Clerk Dashboard
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 dark">
            <SignedOut>
              <AuthPage />
            </SignedOut>
            <SignedIn>
              <AppInner />
            </SignedIn>
            <Toaster />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
