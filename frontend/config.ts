// The Clerk publishable key, to initialize Clerk.
// This should be set as VITE_CLERK_PUBLISHABLE_KEY in your environment variables.
// You can get your key from the Clerk dashboard at https://dashboard.clerk.com/last-active?path=api-keys
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

export const clerkPublishableKey = publishableKey || "pk_test_cG9zc2libGUtbG9uZ2hvcm4tNS5jbGVyay5hY2NvdW50cy5kZXYk";
