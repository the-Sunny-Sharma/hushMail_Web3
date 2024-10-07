"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardStats } from "./_components/DashboardStats";
import { PostsList } from "./_components/PostsList";
import { Button } from "@/components/ui/button";
import { mockPosts, mockStats } from "./_data/mockData";

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats);
  const [posts, setPosts] = useState(mockPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setStats(mockStats);
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardStats stats={stats} isLoading={isLoading} />
      </motion.div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Posts</h2>
          <Link href="/h/create-feed">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PostsList posts={posts} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
