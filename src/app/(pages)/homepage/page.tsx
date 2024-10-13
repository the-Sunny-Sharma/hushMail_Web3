"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Plus,
  Search,
  AlertCircle,
  Share2,
  MoreHorizontal,
  Copy,
  Flag,
  Bookmark,
  Coins,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWalletContext } from "@/context/WalletContext";
import { formatEther } from "ethers";
import { useInView } from "react-intersection-observer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Post {
  postId: string;
  content: string;
  postOwner: string;
  isPublic: boolean;
  manualAccepting: boolean;
  acceptingUntil: bigint;
  creationTime: bigint;
  totalEarnings: bigint;
  totalResponses: bigint;
  identity: {
    name: string;
    username: string;
    avatarUrl: string;
  };
}

export default function HomePage() {
  const { toast } = useToast();
  const { contract, walletAddress } = useWalletContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchedIndex, setLastFetchedIndex] = useState(0);
  const [filter, setFilter] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView();

  const fetchPosts = useCallback(async () => {
    if (!contract) {
      setError(
        "Wallet not connected. Please connect your wallet to view posts."
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching posts...");
      const batchSize = 10;
      const startIndex = lastFetchedIndex + 1;

      console.log(
        `Fetching posts from index ${startIndex} with batch size ${batchSize}`
      );

      const fetchedPosts = await contract.getPostsByPage(startIndex, batchSize);
      console.log("Fetched posts:", fetchedPosts);

      if (fetchedPosts.length === 0) {
        console.log("No more posts to fetch");
        setHasMore(false);
        setLoading(false);
        return;
      }

      const formattedPosts = fetchedPosts
        .filter((post: Post) => post.isPublic && post.content !== "") // Filter out private and deleted posts
        .map((post: Post) => {
          console.log("Formatting post:", post);
          return {
            ...post,
            postId: post.postId.toString(),
            content: post.content || "",
            totalEarnings: formatEther(post.totalEarnings),
            creationTime: Number(post.creationTime) * 1000,
            acceptingUntil: Number(post.acceptingUntil) * 1000,
            totalResponses: Number(post.totalResponses),
            identity: {
              ...post.identity,
              avatarUrl:
                post.identity.avatarUrl || "/default-profile-picture.jpg",
              username: post.identity.username || "Anonymous",
            },
          };
        });

      console.log("Formatted posts:", formattedPosts);

      setPosts((prevPosts) => {
        const newPosts = formattedPosts.filter(
          (newPost) =>
            !prevPosts.some(
              (existingPost) => existingPost.postId === newPost.postId
            )
        );
        console.log("New posts to add:", newPosts);
        return [...prevPosts, ...newPosts];
      });
      setLastFetchedIndex(startIndex + formattedPosts.length - 1);
      setHasMore(formattedPosts.length === batchSize);
      setLoading(false);
      setError(null);
    } catch (error: unknown) {
      console.error("Error fetching posts:", error);
      if (error instanceof Error) {
        setError(`Failed to load posts. Error: ${error.message}`);
      } else {
        setError("An unknown error occurred while fetching posts.");
      }
      setLoading(false);
    }
  }, [contract, lastFetchedIndex]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPosts();
    }
  }, [inView, hasMore, loading, fetchPosts]);

  const filterAndSortPosts = useCallback(() => {
    let filteredPosts = [...posts];

    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.content.toLowerCase().includes(lowercaseSearchTerm) ||
          post.identity.username.toLowerCase().includes(lowercaseSearchTerm)
      );

      // Sort posts by relevance (number of matches)
      filteredPosts.sort((a, b) => {
        const aMatches =
          (
            a.content
              .toLowerCase()
              .match(new RegExp(lowercaseSearchTerm, "g")) || []
          ).length +
          (
            a.identity.username
              .toLowerCase()
              .match(new RegExp(lowercaseSearchTerm, "g")) || []
          ).length;
        const bMatches =
          (
            b.content
              .toLowerCase()
              .match(new RegExp(lowercaseSearchTerm, "g")) || []
          ).length +
          (
            b.identity.username
              .toLowerCase()
              .match(new RegExp(lowercaseSearchTerm, "g")) || []
          ).length;
        return bMatches - aMatches;
      });
    }

    switch (filter) {
      case "recent":
        return filteredPosts.sort((a, b) => b.creationTime - a.creationTime);
      case "earnings":
        return filteredPosts.sort(
          (a, b) =>
            parseFloat(b.totalEarnings.toString()) -
            parseFloat(a.totalEarnings.toString())
        );
      case "responses":
        return filteredPosts.sort(
          (a, b) => Number(b.totalResponses) - Number(a.totalResponses)
        );
      default:
        return filteredPosts;
    }
  }, [posts, filter, searchTerm]);

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link copied!",
        description: "The post link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const [shareClicked, setShareClicked] = useState<string | null>(null);

  const handleShareClick = (postId: string) => {
    setShareClicked(postId);
    copyToClipboard(`${window.location.origin}/h/publicPost/${postId}`);
    setTimeout(() => setShareClicked(null), 500); // Reset after animation
  };

  const filteredPosts = filterAndSortPosts();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Welcome to HushMail</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter posts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="earnings">Highest Earnings</SelectItem>
                <SelectItem value="responses">Most Responses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {!walletAddress && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to view and interact with posts.
            </AlertDescription>
          </Alert>
        )}
        {/* {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.postId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={post.identity.avatarUrl}
                          alt={post.identity.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-sm">
                            {highlightSearchTerm(post.identity.username)}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>
                              {formatDistanceToNow(post.creationTime, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                post.manualAccepting ||
                                Number(post.acceptingUntil) > Date.now()
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={5}>
                            {post.manualAccepting ||
                            Number(post.acceptingUntil) > Date.now()
                              ? "Accepting responses"
                              : "Not accepting responses"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm mb-4 line-clamp-3">
                      {highlightSearchTerm(truncateContent(post.content, 150))}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Coins className="w-4 h-4 mr-1" />
                          <span>{post.totalEarnings} ETH</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{post.totalResponses} Responses</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/h/publicPost/${post.postId}`
                            )
                          }
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                copyToClipboard(
                                  `${window.location.origin}/h/publicPost/${post.postId}`
                                )
                              }
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bookmark className="w-4 h-4 mr-2" />
                              Save Post
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Report Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <Link href={`/posts/${post.postId}`}>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                      View Post
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {loading && <p className="text-center mt-4">Loading posts...</p>}
        {!loading && filteredPosts.length === 0 && (
          <p className="text-center mt-4">No posts found.</p>
        )}
        {!loading && hasMore && (
          <div ref={ref} className="flex justify-center mt-8">
            <Button onClick={fetchPosts} className="px-4 py-2">
              Load More
            </Button>
          </div>
        )}
        {!loading && !hasMore && posts.length > 0 && (
          <p className="text-center mt-4">No more posts to load.</p>
        )}
      </div>
      <Link href="/create-post">
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
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
  );
}
