import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MessageSquare,
  DollarSign,
  Share2,
  Trash2,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext } from "@/context/WalletContext";

interface Post {
  id: string;
  content: string;
  isPublic: boolean;
  manualAccepting: boolean;
  acceptingUntil: string;
  creationTime: string;
  totalResponses: number;
  totalEarnings: string;
  identity: {
    name: string;
    profilePicture: string;
    isAnonymous: boolean;
  };
}

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
}

export function PostsList({ posts, isLoading }: PostsListProps) {
  const { toast } = useToast();
  const { contract } = useWalletContext();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    if (!contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet to delete a post.",
        variant: "destructive",
      });
      return;
    }

    setDeletingPostId(postId);

    try {
      const tx = await contract.deletePost(postId);
      await tx.wait();
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });
      // You might want to refresh the posts list here
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/h/publicPost/${postId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post, index) => (
          <motion.li
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="px-4 py-4 sm:px-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                {post.content}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                <p
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.isPublic
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  }`}
                >
                  {post.isPublic ? "Public" : "Private"}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  {post.totalResponses} responses
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                  <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  {post.totalEarnings} ETH earned
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <p>Posted {new Date(post.creationTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {post.manualAccepting
                ? "Manually accepting responses"
                : `Accepting until ${new Date(
                    post.acceptingUntil
                  ).toLocaleString()}`}
            </div>
            <div className="mt-4 flex space-x-2">
              {/* <Link href={`/h/publicPost/${post.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link> */}
              <Link href={`/posts/${post.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(post.id)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post.id)}
                disabled={deletingPostId === post.id}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deletingPostId === post.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
