Aura Social Media Platform
A modern, full-stack social media platform built with a powerful and scalable tech stack. Aura allows users to connect, share posts, and interact in a beautifully designed, responsive interface.
Features
 * Secure User Authentication: Seamless and secure sign-up and login functionality powered by Clerk.
 * Create & Share Posts: Easily create and share posts with your followers.
 * Interactive Feed: View a live feed of posts from users you follow.
 * User Profiles: View user profiles and manage your own.
 * Fully Responsive: A clean and intuitive UI that works perfectly on both desktop and mobile devices.
Tech Stack
This project is a monorepo built using Bun workspaces.
Frontend
 * Framework: React
 * Language: TypeScript
 * Build Tool: Vite
 * Styling: Tailwind CSS
 * UI Components: Radix UI for unstyled, accessible components.
 * Icons: Lucide React
 * Routing: React Router
 * Data Fetching & State: TanStack Query (React Query)
 * Authentication: Clerk
Backend
 * Framework: Encore.dev (Go Backend Framework)
 * Authentication: Clerk Backend SDK
Project Structure
The project is organized as a monorepo with two main workspaces:
 * frontend/: Contains the entire React frontend application.
 * backend/: Contains the Encore.dev backend services and APIs. The frontend is built and served from this directory in production.
Prerequisites
Before you begin, ensure you have the following installed on your local machine:
 * Bun
 * Encore CLI
 * Go programming language
Getting Started
Follow these steps to get the project up and running on your local machine.
1. Clone the repository:
git clone [https://github.com/Naveen-671/aura-social-media-platform.git](https://github.com/Naveen-671/aura-social-media-platform.git)
cd aura-social-media-platform

2. Install dependencies:
This command will install dependencies for both the frontend and backend workspaces.
bun install

3. Set up Environment Variables:
You will need to create a secrets file for the backend. Create a new file named secrets.json in the backend directory:
# /backend/secrets.json
{
  "ClerkSecretKey": "sk_test_...",
  "ClerkPublishableKey": "pk_test_..."
}

You also need to create a .env.local file in the frontend directory with your Clerk publishable key:
# /frontend/.env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

Replace the placeholder values with your actual keys from the Clerk dashboard.
4. Run the application:
Use the Encore CLI to run the entire stack (both frontend and backend) locally.
encore run

Encore will start the development server, and you can view your application by navigating to the local development dashboard, typically at http://localhost:9400/.

Access the App : https://staging-aura-social-media-platform-nioi.frontend.encr.app
