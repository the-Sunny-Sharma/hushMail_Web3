"use client";

import { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardStats } from "./_components/DashboardStats";
import { PostsList } from "./_components/PostsList";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/context/WalletContext";
import { formatEther } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const { contract, walletAddress } = useWalletContext();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!contract || !walletAddress) {
        setError("Please connect your wallet to view the dashboard.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch user's posts using getPostsByUser
        const userPosts = await contract.getPostsByUser(walletAddress);

        const formattedPosts = userPosts.map((post) => ({
          id: post.postId.toString(),
          content: post.content,
          isPublic: post.isPublic,
          manualAccepting: post.manualAcceting, // Note: There's a typo in the contract ('manualAcceting')
          acceptingUntil: new Date(
            Number(post.acceptingUntil) * 1000
          ).toISOString(),
          creationTime: new Date(
            Number(post.creationTime) * 1000
          ).toISOString(),
          totalResponses: Number(post.totalResponses),
          totalEarnings: formatEther(post.totalEarnings),
          identity: {
            name: post.identity.name,
            profilePicture: post.identity.avatarUrl,
            isAnonymous: !post.identity.name && !post.identity.username,
          },
        }));

        setPosts(formattedPosts);

        // Calculate dashboard stats
        const totalPosts = formattedPosts.length;
        const totalResponses = formattedPosts.reduce(
          (sum, post) => sum + post.totalResponses,
          0
        );
        const activePosts = formattedPosts.filter(
          (post) =>
            post.manualAccepting || new Date(post.acceptingUntil) > new Date()
        ).length;
        const publicPosts = formattedPosts.filter(
          (post) => post.isPublic
        ).length;
        const privatePosts = totalPosts - publicPosts;
        const totalEarnings = formattedPosts.reduce(
          (sum, post) => sum + parseFloat(post.totalEarnings),
          0
        );
        const latestResponse =
          formattedPosts.length > 0
            ? new Date(
                Math.max(
                  ...formattedPosts.map((post) => new Date(post.creationTime))
                )
              ).toISOString()
            : "No responses yet";

        setStats({
          totalPosts,
          totalResponses,
          activePosts,
          publicPosts,
          privatePosts,
          latestResponse,
          totalEarnings: totalEarnings.toFixed(4),
        });

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [contract, walletAddress]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardStats stats={stats} isLoading={isLoading} />
      </motion.div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Your Posts</h2>
          <Link href="/create-post">
            <Button className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>
        {posts.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Welcome to HushMail!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't created any posts yet. Start sharing your thoughts and
              earning rewards!
            </p>
            <Link href="/create-post">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PostsList posts={posts} isLoading={isLoading} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
