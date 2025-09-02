// import { Heart, MessageCircle, UserPlus, Share } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// interface Notification {
//   id: string;
//   type: "like" | "comment" | "follow" | "share";
//   user: {
//     username: string;
//     avatar: string;
//   };
//   message: string;
//   time: string;
//   read: boolean;
// }

// export default function NotificationsPage() {
//   const notifications: Notification[] = [
//     {
//       id: "1",
//       type: "like",
//       user: { username: "alex_photographer", avatar: "https://i.pravatar.cc/150?img=1" },
//       message: "liked your post",
//       time: "2m ago",
//       read: false,
//     },
//     {
//       id: "2",
//       type: "comment",
//       user: { username: "sarah_travels", avatar: "https://i.pravatar.cc/150?img=2" },
//       message: "commented on your post: \"Amazing shot! 📸\"",
//       time: "5m ago",
//       read: false,
//     },
//     {
//       id: "3",
//       type: "follow",
//       user: { username: "urban_artist", avatar: "https://i.pravatar.cc/150?img=3" },
//       message: "started following you",
//       time: "10m ago",
//       read: true,
//     },
//     {
//       id: "4",
//       type: "share",
//       user: { username: "food_explorer", avatar: "https://i.pravatar.cc/150?img=4" },
//       message: "shared your post",
//       time: "15m ago",
//       read: true,
//     },
//     {
//       id: "5",
//       type: "like",
//       user: { username: "nature_lover", avatar: "https://i.pravatar.cc/150?img=5" },
//       message: "and 12 others liked your post",
//       time: "1h ago",
//       read: true,
//     },
//     {
//       id: "6",
//       type: "comment",
//       user: { username: "creative_soul", avatar: "https://i.pravatar.cc/150?img=6" },
//       message: "replied to your comment",
//       time: "2h ago",
//       read: true,
//     },
//   ];

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "like":
//         return <Heart size={16} className="text-red-500" fill="currentColor" />;
//       case "comment":
//         return <MessageCircle size={16} className="text-blue-500" />;
//       case "follow":
//         return <UserPlus size={16} className="text-green-500" />;
//       case "share":
//         return <Share size={16} className="text-purple-500" />;
//       default:
//         return <Heart size={16} className="text-gray-400" />;
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto py-6 px-4">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-white flex items-center">
//           <Heart size={28} className="mr-3 text-purple-400" />
//           Notifications
//         </h1>
//       </div>

//       <div className="space-y-2">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-700/30 ${
//               !notification.read ? "ring-2 ring-purple-500/30" : ""
//             }`}
//           >
//             <div className="flex items-start space-x-3">
//               <div className="relative">
//                 <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
//                   <AvatarImage src={notification.user.avatar} />
//                   <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
//                     {notification.user.username.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-800">
//                   {getNotificationIcon(notification.type)}
//                 </div>
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-200">
//                     <span className="font-semibold text-white hover:text-purple-300 cursor-pointer">
//                       {notification.user.username}
//                     </span>{" "}
//                     {notification.message}
//                   </p>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xs text-gray-400">{notification.time}</span>
//                     {!notification.read && (
//                       <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                     )}
//                   </div>
//                 </div>

//                 {notification.type === "follow" && (
//                   <div className="mt-3">
//                     <Button
//                       size="sm"
//                       className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-4 transition-all duration-200 hover:scale-105"
//                     >
//                       Follow Back
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mark all as read */}
//       <div className="mt-8 text-center">
//         <Button
//           variant="outline"
//           className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 rounded-xl"
//         >
//           Mark All as Read
//         </Button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Notification = {
  id: number;
  type: "like" | "comment" | "follow" | "mention";
  user: string;
  userImg: string;
  message: string;
  time: string;
};

const demoNotifications: Notification[] = [
  {
    id: 1,
    type: "like",
    user: "alex_dev",
    userImg: "https://i.pravatar.cc/150?img=32",
    message: "liked your post",
    time: "2m ago",
  },
  {
    id: 2,
    type: "comment",
    user: "sarah_01",
    userImg: "https://i.pravatar.cc/150?img=21",
    message: "commented: 🔥🔥🔥",
    time: "10m ago",
  },
  {
    id: 3,
    type: "follow",
    user: "john_doe",
    userImg: "https://i.pravatar.cc/150?img=14",
    message: "started following you",
    time: "30m ago",
  },
  {
    id: 4,
    type: "mention",
    user: "maria_js",
    userImg: "https://i.pravatar.cc/150?img=8",
    message: "mentioned you in a comment",
    time: "1h ago",
  },
	   {
       id: "5",
       type: "like",
       user: { username: "nature_lover", avatar: "https://i.pravatar.cc/150?img=5" },
       message: "and 12 others liked your post",
       time: "1h ago",
       read: true,
     },
     {
       id: "6",
       type: "comment",
       user: { username: "creative_soul", avatar: "https://i.pravatar.cc/150?img=6" },
       message: "replied to your comment",
       time: "2h ago",
       read: true,
     },
];

export default function NotificationPage() {
  const [notifications] = useState(demoNotifications);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6" /> Notifications
      </h1>

      <div className="flex flex-col gap-4">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar>
                <AvatarImage src={n.userImg} alt={n.user} />
                <AvatarFallback>{n.user[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{n.user}</span> {n.message}
                </p>
                <p className="text-xs text-zinc-400">{n.time}</p>
              </div>
              {n.type === "like" && <Heart className="w-5 h-5 text-red-500" />}
              {n.type === "comment" && (
                <MessageCircle className="w-5 h-5 text-blue-400" />
              )}
              {n.type === "follow" && (
                <UserPlus className="w-5 h-5 text-green-400" />
              )}
              {n.type === "mention" && (
                <MessageCircle className="w-5 h-5 text-purple-400" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
