import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Grid, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import { useBackend } from "../hooks/useBackend";

/**
 * ProfilePage
 * - Shows user header (via ProfileHeader)
 * - Tabs: Posts / Liked / Saved (each loads on demand)
 * - Adds richer profile details & recent comments/activity fallback
 * - Keeps reactive refresh via window events (postCreated, postUpdated, activityUpdated)
 */
export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "saved">("posts");
  const backend = useBackend();
  const qc = useQueryClient();

  // --- user query ---
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => backend.users.getUser({ id: userId! }),
    enabled: !!userId,
    // keep staleTime small for demo; adjust as needed
  });

  // --- posts (author) query; only enabled when posts tab active so tab switching is efficient ---
  const postsQuery = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      const res = await backend.posts.listPosts({ authorId: userId });
      // normalize and newest-first
      const posts = (res.posts || []).map((p: any) => ({
        ...p,
        createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      })).slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { ...res, posts };
    },
    enabled: !!userId && activeTab === "posts",
  });

  // --- liked posts ---
  const likedQuery = useQuery({
    queryKey: ["user-liked-posts", userId],
    queryFn: () => backend.posts.listLikedPosts?.({ userId }) ?? Promise.resolve({ posts: [] }),
    enabled: !!userId && activeTab === "liked",
  });

  // --- saved posts ---
  const savedQuery = useQuery({
    queryKey: ["user-saved-posts", userId],
    queryFn: () => backend.posts.listSavedPosts?.({ userId }) ?? Promise.resolve({ posts: [] }),
    enabled: !!userId && activeTab === "saved",
  });

  // --- reactive refresh on common global events so UI updates across pages ---
  useEffect(() => {
    const refresh = () => {
      qc.invalidateQueries({ queryKey: ["user-posts", userId] });
      qc.invalidateQueries({ queryKey: ["user-liked-posts", userId] });
      qc.invalidateQueries({ queryKey: ["user-saved-posts", userId] });
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    };

    const handlers = ["postCreated", "postUpdated", "postDeleted", "activityUpdated", "commentCreated"];
    handlers.forEach((ev) => window.addEventListener(ev, refresh));
    return () => handlers.forEach((ev) => window.removeEventListener(ev, refresh));
  }, [qc, userId]);

  // --- loading / error states ---
  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse mb-6">
          <div className="flex items-center space-x-8">
            <div className="h-32 w-32 bg-gray-700 rounded-full"></div>
            <div className="space-y-4 flex-1">
              <div className="h-8 w-32 bg-gray-700 rounded"></div>
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
              <div className="flex space-x-8">
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
                <div className="h-6 w-20 bg-gray-700 rounded"></div>
                <div className="h-6 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">User not found</p>
        </div>
      </div>
    );
  }

  // --- demo/fallback data if backend returns sparse info ---
  const demoFallbackUser = {
    id: userId || "demo-user",
    username: userData.username ?? userData.handle ?? `user_${userId ?? "demo"}`,
    fullName: userData.name ?? userData.fullName ?? "Aura Demo User",
    avatarUrl: userData.avatarUrl ?? userData.profileImage ?? `https://i.pravatar.cc/150?u=${userId ?? "demo"}`,
    bio: userData.bio ?? "✨ Exploring Aura • photography & design • coffee enthusiast ☕",
    website: userData.website ?? "https://example.com",
    location: userData.location ?? "Earth",
    followersCount: userData.followersCount ?? userData.followers ?? 1250,
    followingCount: userData.followingCount ?? userData.following ?? 480,
    createdAt: userData.createdAt ?? userData.joinedAt ?? new Date().toISOString(),
  };

  // posts fallback (if backend posts empty)
  const demoPosts = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: `demo-${i}`,
        author: { id: demoFallbackUser.id, username: demoFallbackUser.username, avatarUrl: demoFallbackUser.avatarUrl },
        imageUrl: `https://picsum.photos/seed/profile-${demoFallbackUser.id}-${i}/800/800`,
        caption: ["Chasing sunsets 🌇", "Coffee + code ☕💻", "Weekend hike 🌲", "City vibes ✨"][i % 4],
        createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 50),
        // small comments sample
        commentsList: [
          { id: `c-${i}-1`, user: { username: "alex" }, text: "Love this!" },
          { id: `c-${i}-2`, user: { username: "sarah" }, text: "Amazing shot 📸" },
        ],
      })),
    [userData]
  );

  // --- tabs metadata ---
  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "liked", label: "Liked", icon: Heart },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  //--- pick active data & loading flag ---
  const activeData =
    activeTab === "posts"
      ? postsQuery.data?.posts ?? demoPosts
      : activeTab === "liked"
      ? likedQuery.data?.posts ?? []
      : savedQuery.data?.posts ?? [];

  const activeLoading = activeTab === "posts" ? postsQuery.isLoading : activeTab === "liked" ? likedQuery.isLoading : savedQuery.isLoading;

  // --- derive recent comments/activity from posts if available, otherwise demo ---
  const recentActivity = useMemo(() => {
    const sourcePosts = postsQuery.data?.posts ?? demoPosts;
    const comments: any[] = [];
    (sourcePosts || []).forEach((p: any) => {
      const cs = p.commentsList ?? p.comments ?? [];
      // if `comments` is a number, skip; if array, gather
      if (Array.isArray(cs)) {
        cs.slice(0, 3).forEach((c: any) =>
          comments.push({
            postId: p.id,
            postImage: p.imageUrl ?? p.image ?? `https://picsum.photos/seed/post-${p.id}/200/200`,
            user: c.user?.username ?? c.user ?? "someone",
            text: c.text ?? c.body ?? "Nice!",
            time: c.createdAt ?? p.createdAt,
          })
        );
      }
    });
    // limit and return
    return comments.slice(0, 6);
  }, [postsQuery.data]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Profile header component - ensure it accepts these props */}
      <ProfileHeader
        user={{
          id: demoFallbackUser.id,
          username: demoFallbackUser.username,
          fullName: demoFallbackUser.fullName,
          avatarUrl: demoFallbackUser.avatarUrl,
          bio: demoFallbackUser.bio,
          website: demoFallbackUser.website,
          location: demoFallbackUser.location,
          followersCount: demoFallbackUser.followersCount,
          followingCount: demoFallbackUser.followingCount,
          createdAt: demoFallbackUser.createdAt,
        }}
        postCount={(postsQuery.data?.posts?.length ?? demoPosts.length)}
      />

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden mt-6">
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id as "posts" | "liked" | "saved")}
                className={`flex-1 py-4 rounded-none transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-500/20 text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                }`}
              >
                <IconComponent size={20} className="mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: main tab content (posts/liked/saved) */}
          <div className="md:col-span-2">
            {activeTab === "posts" && (
              <>
                {activeLoading ? (
                  <div className="grid grid-cols-3 gap-1 md:gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-700 animate-pulse rounded-lg md:rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <PostGrid posts={activeData} />
                )}
              </>
            )}

            {activeTab === "liked" && (
              <>
                {activeLoading ? (
                  <div className="text-center py-12">Loading liked posts...</div>
                ) : activeData.length ? (
                  <PostGrid posts={activeData} />
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-6 bg-gray-700/50 rounded-full">
                        <Heart size={48} className="text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-lg">No liked posts yet</p>
                      <p className="text-gray-500 text-sm">Posts you like will appear here</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "saved" && (
              <>
                {activeLoading ? (
                  <div className="text-center py-12">Loading saved posts...</div>
                ) : activeData.length ? (
                  <PostGrid posts={activeData} />
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-6 bg-gray-700/50 rounded-full">
                        <Bookmark size={48} className="text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-lg">No saved posts yet</p>
                      <p className="text-gray-500 text-sm">Save posts to view them later</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: profile details & recent activity */}
          <aside className="md:col-span-1 space-y-6">
            {/* Quick stats */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
              <h4 className="text-sm text-gray-300 font-semibold mb-3">Profile</h4>
              <div className="flex items-center space-x-3">
                <img src={demoFallbackUser.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full ring-2 ring-purple-500/30" />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-white">{demoFallbackUser.username}</p>
                    <span className="text-xs text-gray-400">• @{demoFallbackUser.username}</span>
                  </div>
                  <p className="text-sm text-gray-400">{demoFallbackUser.bio}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-center text-sm text-gray-300">
                <div>
                  <div className="font-semibold text-white">{postsQuery.data?.posts?.length ?? demoPosts.length}</div>
                  <div className="text-xs">Posts</div>
                </div>
                <div>
                  <div className="font-semibold text-white">{demoFallbackUser.followersCount}</div>
                  <div className="text-xs">Followers</div>
                </div>
                <div>
                  <div className="font-semibold text-white">{demoFallbackUser.followingCount}</div>
                  <div className="text-xs">Following</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 border-0">Follow</Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">Message</Button>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                <div>Location: {demoFallbackUser.location}</div>
                <div>Website: <a className="text-purple-300" href={demoFallbackUser.website} target="_blank" rel="noreferrer">{demoFallbackUser.website}</a></div>
                <div>Joined: {new Date(demoFallbackUser.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Recent activity / comments */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
              <h4 className="text-sm text-gray-300 font-semibold mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {recentActivity.length ? (
                  recentActivity.map((c, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <img src={c.postImage} alt="thumb" className="w-12 h-12 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200"><span className="font-semibold text-white">{c.user}</span> commented</div>
                        <div className="text-xs text-gray-400 truncate">{c.text}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">No recent activity</div>
                )}
              </div>
            </div>

            {/* Highlights / Story placeholders */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
              <h4 className="text-sm text-gray-300 font-semibold mb-3">Highlights</h4>
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                    Story {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}



// // import { useQuery } from "@tanstack/react-query";
// // import { useParams } from "react-router-dom";
// // import { useState } from "react";
// // import { Grid, Heart, Bookmark } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import ProfileHeader from "../components/ProfileHeader";
// // import PostGrid from "../components/PostGrid";
// // import { useBackend } from "../hooks/useBackend";

// // export default function ProfilePage() {
// //   const { userId } = useParams<{ userId: string }>();
// //   const [activeTab, setActiveTab] = useState<"posts" | "liked" | "saved">("posts");
// //   const backend = useBackend();

// //   const { data: userData, isLoading: userLoading, error: userError } = useQuery({
// //     queryKey: ["user", userId],
// //     queryFn: () => backend.users.getUser({ id: userId! }),
// //     enabled: !!userId,
// //   });

// //   const { data: postsData, isLoading: postsLoading } = useQuery({
// //     queryKey: ["user-posts", userId],
// //     queryFn: () => backend.posts.listPosts({ authorId: userId }),
// //     enabled: !!userId,
// //   });

// //   if (userLoading) {
// //     return (
// //       <div className="max-w-4xl mx-auto py-6 px-4">
// //         <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse mb-6">
// //           <div className="flex items-center space-x-8">
// //             <div className="h-32 w-32 bg-gray-700 rounded-full"></div>
// //             <div className="space-y-4 flex-1">
// //               <div className="h-8 w-32 bg-gray-700 rounded"></div>
// //               <div className="h-4 w-48 bg-gray-700 rounded"></div>
// //               <div className="flex space-x-8">
// //                 <div className="h-6 w-16 bg-gray-700 rounded"></div>
// //                 <div className="h-6 w-20 bg-gray-700 rounded"></div>
// //                 <div className="h-6 w-20 bg-gray-700 rounded"></div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (userError || !userData) {
// //     return (
// //       <div className="max-w-4xl mx-auto py-8 px-4 text-center">
// //         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
// //           <p className="text-red-400">User not found</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const tabs = [
// //     { id: "posts", label: "Posts", icon: Grid },
// //     { id: "liked", label: "Liked", icon: Heart },
// //     { id: "saved", label: "Saved", icon: Bookmark },
// //   ];

// //   return (
// //     <div className="max-w-4xl mx-auto py-6 px-4">
// //       <ProfileHeader
// //         user={userData}
// //         postCount={postsData?.posts.length || 0}
// //       />

// //       {/* Tabs */}
// //       <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
// //         <div className="flex border-b border-gray-700/50">
// //           {tabs.map((tab) => {
// //             const IconComponent = tab.icon;
// //             return (
// //               <Button
// //                 key={tab.id}
// //                 variant="ghost"
// //                 onClick={() => setActiveTab(tab.id as "posts" | "liked" | "saved")}
// //                 className={`flex-1 py-4 rounded-none transition-all duration-200 ${
// //                   activeTab === tab.id
// //                     ? "bg-purple-500/20 text-purple-400 border-b-2 border-purple-400"
// //                     : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
// //                 }`}
// //               >
// //                 <IconComponent size={20} className="mr-2" />
// //                 {tab.label}
// //               </Button>
// //             );
// //           })}
// //         </div>

// //         <div className="p-6">
// //           {activeTab === "posts" && (
// //             <>
// //               {postsLoading ? (
// //                 <div className="grid grid-cols-3 gap-1 md:gap-3">
// //                   {[...Array(6)].map((_, i) => (
// //                     <div key={i} className="aspect-square bg-gray-700 animate-pulse rounded-lg md:rounded-xl"></div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <PostGrid posts={postsData?.posts || []} />
// //               )}
// //             </>
// //           )}

// //           {activeTab === "liked" && (
// //             <div className="text-center py-12">
// //               <div className="flex flex-col items-center space-y-4">
// //                 <div className="p-6 bg-gray-700/50 rounded-full">
// //                   <Heart size={48} className="text-gray-400" />
// //                 </div>
// //                 <p className="text-gray-400 text-lg">No liked posts yet</p>
// //                 <p className="text-gray-500 text-sm">Posts you like will appear here</p>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === "saved" && (
// //             <div className="text-center py-12">
// //               <div className="flex flex-col items-center space-y-4">
// //                 <div className="p-6 bg-gray-700/50 rounded-full">
// //                   <Bookmark size={48} className="text-gray-400" />
// //                 </div>
// //                 <p className="text-gray-400 text-lg">No saved posts yet</p>
// //                 <p className="text-gray-500 text-sm">Save posts to view them later</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // profilePage.tsx
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Grid, Heart, Bookmark } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ProfileHeader from "../components/ProfileHeader";
// import PostGrid from "../components/PostGrid";
// import { useBackend } from "../hooks/useBackend";

// export default function ProfilePage() {
//   const { userId } = useParams<{ userId: string }>();
//   const [activeTab, setActiveTab] = useState<"posts" | "liked" | "saved">("posts");
//   const backend = useBackend();
//   const qc = useQueryClient();

//   // user
//   const { data: userData, isLoading: userLoading, error: userError } = useQuery({
//     queryKey: ["user", userId],
//     queryFn: () => backend.users.getUser({ id: userId! }),
//     enabled: !!userId,
//   });

//   // posts (author)
//   const postsQuery = useQuery({
//     queryKey: ["user-posts", userId],
//     queryFn: async () => {
//       const res = await backend.posts.listPosts({ authorId: userId });
//       // ensure newest first
//       return {
//         ...res,
//         posts: (res.posts || []).slice().sort((a: any, b: any) => {
//           const da = new Date(a.createdAt).getTime();
//           const db = new Date(b.createdAt).getTime();
//           return db - da;
//         }),
//       };
//     },
//     enabled: !!userId && activeTab === "posts",
//   });

//   // liked posts
//   const likedQuery = useQuery({
//     queryKey: ["user-liked-posts", userId],
//     queryFn: () => backend.posts.listLikedPosts?.({ userId }) ?? Promise.resolve({ posts: [] }),
//     enabled: !!userId && activeTab === "liked",
//   });

//   // saved posts
//   const savedQuery = useQuery({
//     queryKey: ["user-saved-posts", userId],
//     queryFn: () => backend.posts.listSavedPosts?.({ userId }) ?? Promise.resolve({ posts: [] }),
//     enabled: !!userId && activeTab === "saved",
//   });

//   // react to global changes from create/edit/delete flows
//   useEffect(() => {
//     const refresh = () => {
//       qc.invalidateQueries({ queryKey: ["user-posts", userId] });
//       qc.invalidateQueries({ queryKey: ["user-liked-posts", userId] });
//       qc.invalidateQueries({ queryKey: ["user-saved-posts", userId] });
//       qc.invalidateQueries({ queryKey: ["user", userId] });
//     };

//     const handlers = ["postCreated", "postUpdated", "postDeleted", "activityUpdated"];
//     handlers.forEach((ev) => window.addEventListener(ev, refresh));
//     return () => handlers.forEach((ev) => window.removeEventListener(ev, refresh));
//   }, [qc, userId]);

//   if (userLoading) {
//     return (
//       <div className="max-w-4xl mx-auto py-6 px-4">
//         {/* skeleton (unchanged) */}
//         <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse mb-6">
//           <div className="flex items-center space-x-8">
//             <div className="h-32 w-32 bg-gray-700 rounded-full"></div>
//             <div className="space-y-4 flex-1">
//               <div className="h-8 w-32 bg-gray-700 rounded"></div>
//               <div className="h-4 w-48 bg-gray-700 rounded"></div>
//               <div className="flex space-x-8">
//                 <div className="h-6 w-16 bg-gray-700 rounded"></div>
//                 <div className="h-6 w-20 bg-gray-700 rounded"></div>
//                 <div className="h-6 w-20 bg-gray-700 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (userError || !userData) {
//     return (
//       <div className="max-w-4xl mx-auto py-8 px-4 text-center">
//         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
//           <p className="text-red-400">User not found</p>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: "posts", label: "Posts", icon: Grid },
//     { id: "liked", label: "Liked", icon: Heart },
//     { id: "saved", label: "Saved", icon: Bookmark },
//   ];

//   // choose data based on active tab
//   const activeData =
//     activeTab === "posts" ? postsQuery.data?.posts ?? [] : activeTab === "liked" ? likedQuery.data?.posts ?? [] : savedQuery.data?.posts ?? [];

//   const activeLoading = activeTab === "posts" ? postsQuery.isLoading : activeTab === "liked" ? likedQuery.isLoading : savedQuery.isLoading;

//   return (
//     <div className="max-w-4xl mx-auto py-6 px-4">
//       <ProfileHeader user={userData} postCount={(postsQuery.data?.posts?.length ?? 0)} />

//       {/* Tabs */}
//       <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
//         <div className="flex border-b border-gray-700/50">
//           {tabs.map((tab) => {
//             const IconComponent = tab.icon;
//             return (
//               <Button
//                 key={tab.id}
//                 variant="ghost"
//                 onClick={() => setActiveTab(tab.id as "posts" | "liked" | "saved")}
//                 className={`flex-1 py-4 rounded-none transition-all duration-200 ${
//                   activeTab === tab.id
//                     ? "bg-purple-500/20 text-purple-400 border-b-2 border-purple-400"
//                     : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
//                 }`}
//               >
//                 <IconComponent size={20} className="mr-2" />
//                 {tab.label}
//               </Button>
//             );
//           })}
//         </div>

//         <div className="p-6">
//           {activeTab === "posts" && (
//             <>
//               {activeLoading ? (
//                 <div className="grid grid-cols-3 gap-1 md:gap-3">
//                   {[...Array(6)].map((_, i) => (
//                     <div key={i} className="aspect-square bg-gray-700 animate-pulse rounded-lg md:rounded-xl"></div>
//                   ))}
//                 </div>
//               ) : (
//                 <PostGrid posts={activeData} />
//               )}
//             </>
//           )}

//           {activeTab === "liked" && (
//             <>
//               {activeLoading ? (
//                 <div className="text-center py-12">Loading liked posts...</div>
//               ) : activeData.length ? (
//                 <PostGrid posts={activeData} />
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="flex flex-col items-center space-y-4">
//                     <div className="p-6 bg-gray-700/50 rounded-full">
//                       <Heart size={48} className="text-gray-400" />
//                     </div>
//                     <p className="text-gray-400 text-lg">No liked posts yet</p>
//                     <p className="text-gray-500 text-sm">Posts you like will appear here</p>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {activeTab === "saved" && (
//             <>
//               {activeLoading ? (
//                 <div className="text-center py-12">Loading saved posts...</div>
//               ) : activeData.length ? (
//                 <PostGrid posts={activeData} />
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="flex flex-col items-center space-y-4">
//                     <div className="p-6 bg-gray-700/50 rounded-full">
//                       <Bookmark size={48} className="text-gray-400" />
//                     </div>
//                     <p className="text-gray-400 text-lg">No saved posts yet</p>
//                     <p className="text-gray-500 text-sm">Save posts to view them later</p>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

