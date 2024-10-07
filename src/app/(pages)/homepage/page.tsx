"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock, MessageCircle, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Post {
  _id: string;
  content: string;
  username: string | null;
  profilePicture: string | null;
  timestamp: string;
  responseCount: number;
  acceptingResponses: boolean;
}

const mockPosts: Post[] = [
  {
    _id: "1",
    content: "Just deployed my first smart contract on Ethereum!",
    username: "eth_dev",
    profilePicture: "/placeholder-user-1.jpg",
    timestamp: new Date().toISOString(),
    responseCount: 5,
    acceptingResponses: true,
  },
  {
    _id: "2",
    content: "What are your thoughts on the latest DeFi trends?",
    username: "defi_enthusiast",
    profilePicture: "/placeholder-user-2.jpg",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    responseCount: 10,
    acceptingResponses: true,
  },
  {
    _id: "3",
    content: "NFT art is revolutionizing the digital art space!",
    username: "nft_artist",
    profilePicture: "/placeholder-user-3.jpg",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    responseCount: 8,
    acceptingResponses: false,
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setPosts(mockPosts);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to HushMail</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/h/publicPost/${post._id}`} key={post._id}>
                <div className="overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out relative bg-white dark:bg-gray-800">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={
                            post.profilePicture || "/placeholder-anonymous.jpg"
                          }
                          alt={post.username || "Anonymous"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                          {post.username || "Anonymous"}
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          post.acceptingResponses
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                    <p className="text-base mb-4 line-clamp-3 text-gray-700 dark:text-gray-300">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(post.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.responseCount} Responses</span>
                      </div>
                    </div>
                    <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-700 dark:text-gray-300">
              Loading posts...
            </p>
          )}
        </div>

        {/* Floating "Post Your Feed" Button */}
        <Link href="/h/create-feed">
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="rounded-full shadow-lg">
              <Plus className="w-6 h-6" />
              <span className="sr-only">Post your feed</span>
            </Button>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 right-0"
                >
                  <div className="bg-gray-800 dark:bg-gray-700 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                    Post your feed
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
