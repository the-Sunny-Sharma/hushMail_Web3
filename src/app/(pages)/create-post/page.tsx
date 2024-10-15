"use client";

import { useState, useEffect } from "react";
// import { useWallet } from "@/hooks/useWallet";
import axios from "axios";
import {
  Globe,
  Lock,
  User,
  UserX,
  Sparkles,
  AlertCircle,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseEther } from "ethers";
import { useSession } from "next-auth/react";
import { useWalletContext } from "@/context/WalletContext";

export default function CreateFeedPage() {
  // const { walletAddress, contract } = useWallet();
  const { walletAddress, contract } = useWalletContext();
  const { data: session } = useSession();
  const [feedContent, setFeedContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showIdentity, setShowIdentity] = useState(true);
  const [manualAccepting, setManualAccepting] = useState(false);
  const [acceptingUntil, setAcceptingUntil] = useState("");
  const [isAIAssistLoading, setIsAIAssistLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState("0.001");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCharacterCount(feedContent.length);
    setEstimatedCost((0.001 + (feedContent.length / 1000) * 0.0001).toFixed(7));
  }, [feedContent]);

  const validateForm = () => {
    if (!feedContent.trim()) {
      toast.error("Post content cannot be empty");
      return false;
    }
    if (!manualAccepting && !acceptingUntil) {
      toast.error(
        "Please set an 'Accepting Until' date or enable Manual Accepting"
      );
      return false;
    }
    if (!manualAccepting && new Date(acceptingUntil) <= new Date()) {
      toast.error("'Accepting Until' date must be in the future");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!contract || !walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      const name = showIdentity && session?.user?.name ? session.user.name : "";
      const username =
        showIdentity && session?.user?.name
          ? session.user.name.replace(/\s+/g, "").toLowerCase()
          : "";
      const avatarUrl =
        showIdentity && session?.user?.image ? session.user.image : "";

      const tx = await contract.createPost(
        feedContent,
        isPublic,
        manualAccepting,
        !showIdentity,
        name,
        username,
        avatarUrl,
        manualAccepting ? 0 : new Date(acceptingUntil).getTime() / 1000,
        { value: parseEther(estimatedCost) }
      );

      toast.loading("Creating post...", { id: "create-post" });
      await tx.wait();
      toast.success("Post created successfully", { id: "create-post" });
      setFeedContent("");
      setAcceptingUntil("");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post. Please try again.", {
        id: "create-post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleAIAssist = async () => {
  //   setIsAIAssistLoading(true);
  //   try {
  //     const response = await fetch("/api/ai-assist", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: feedContent }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("AI assistance request failed");
  //     }
  //     const data = await response.json();
  //     setFeedContent(
  //       (prevContent) =>
  //         prevContent + (prevContent ? "\n\n" : "") + data.suggestion
  //     );
  //   } catch (error) {
  //     console.error("Error getting AI assistance:", error);
  //     toast.error("Error while communicating with AI");
  //   } finally {
  //     setIsAIAssistLoading(false);
  //   }
  // };

  const handleAIAssist = async () => {
    setIsAIAssistLoading(true);
    try {
      const response = await axios.post("/api/ai-assist-post", {
        content: feedContent,
      });
      const newContent =
        feedContent + (feedContent ? "\n\n" : "") + response.data.suggestion;
      setFeedContent(newContent);
      setCharacterCount(newContent.length);
      setEstimatedCost(
        (0.001 + (newContent.length / 1000) * 0.0001).toFixed(7)
      );
      toast.success("AI suggestion added successfully");
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      toast.error("Failed to generate AI response. Please try again.");
    } finally {
      setIsAIAssistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-3xl mx-auto bg-white dark:bg-[#1e2837] text-gray-900 dark:text-white shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Alert className="bg-gray-100 dark:bg-[#2c3e50] border-gray-200 dark:border-[#34495e] mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                Creating a post will cost at least 0.001 ETH.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label
                htmlFor="feedContent"
                className="text-gray-700 dark:text-gray-300"
              >
                Post Content
              </Label>
              <div className="relative">
                <Textarea
                  id="feedContent"
                  value={feedContent}
                  onChange={(e) => setFeedContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[150px] dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] focus:border-blue-500 dark:focus:border-[#3498db] placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 ease-in-out"
                  required
                />
                <AnimatePresence>
                  {feedContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-2 left-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {characterCount} characters
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  type="button"
                  onClick={handleAIAssist}
                  disabled={isAIAssistLoading}
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                  size="sm"
                >
                  {isAIAssistLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Assist
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublic"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label
                        htmlFor="isPublic"
                        className="flex items-center cursor-pointer"
                      >
                        {isPublic ? (
                          <Globe className="w-4 h-4 mr-1" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1" />
                        )}
                        {isPublic ? "Public" : "Private"}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPublic
                      ? "Your post will be visible to everyone"
                      : "Your post will be private"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showIdentity"
                        checked={showIdentity}
                        onCheckedChange={setShowIdentity}
                      />
                      <Label
                        htmlFor="showIdentity"
                        className="flex items-center cursor-pointer"
                      >
                        {showIdentity ? (
                          <User className="w-4 h-4 mr-1" />
                        ) : (
                          <UserX className="w-4 h-4 mr-1" />
                        )}
                        {showIdentity ? "Show Identity" : "Hide Identity"}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showIdentity
                      ? "Your identity will be shown"
                      : "Your identity will be hidden"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="manualAccepting"
                  checked={manualAccepting}
                  onCheckedChange={setManualAccepting}
                />
                <Label htmlFor="manualAccepting" className="cursor-pointer">
                  Manual Accepting
                </Label>
              </div>
              <AnimatePresence>
                {!manualAccepting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label
                      htmlFor="acceptingUntil"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Accepting Until
                    </Label>
                    <input
                      id="acceptingUntil"
                      type="datetime-local"
                      value={acceptingUntil}
                      onChange={(e) => setAcceptingUntil(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      required={!manualAccepting}
                      className="w-full dark:bg-[#2c3e50] text-gray-900 dark:text-white border border-gray-300 dark:border-[#34495e] rounded-md p-2 focus:border-blue-500 dark:focus:border-[#3498db] focus:outline-none transition-all duration-300 ease-in-out"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full text-sm">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Estimated processing time: ~30 seconds
            </span>
            <span className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Estimated cost: {estimatedCost} ETH
            </span>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e as any)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
