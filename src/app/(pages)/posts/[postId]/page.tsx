"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import {
  Clock,
  MessageCircle,
  Sparkles,
  User,
  UserX,
  Share2,
  Edit,
  Trash2,
  Globe,
  Lock,
  AlertCircle,
  DollarSign,
  Loader2,
  Coins,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletContext } from "@/context/WalletContext";
import { formatEther, parseEther } from "ethers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface Post {
  postId: string;
  content: string;
  postOwner: string;
  isPublic: boolean;
  manualAcceting: boolean;
  acceptingUntil: number;
  creationTime: number;
  totalEarnings: string;
  totalResponses: number;
  identity: {
    name: string;
    username: string;
    avatarUrl: string;
  };
}

interface Response {
  refPostId: string;
  responseId: string;
  responder: string;
  content: string;
  amountTransferredInWei: string;
  creationTime: number;
  identity: {
    name: string;
    username: string;
    avatarUrl: string;
  };
}

export default function PostDetails({
  params,
}: {
  params: { postId: string[] };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { contract, walletAddress } = useWalletContext();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState("");
  const [responseAmount, setResponseAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAIAssistLoading, setIsAIAssistLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedIsPublic, setEditedIsPublic] = useState(false);
  const [editedManualAccepting, setEditedManualAccepting] = useState(false);
  const [editedAcceptingUntil, setEditedAcceptingUntil] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState("0.001");

  useEffect(() => {
    const fetchPostAndResponses = async () => {
      if (!contract) return;

      try {
        const postId = params.postId[0];
        const fetchedPost = await contract.posts(postId);
        setPost({
          postId: fetchedPost.postId.toString(),
          content: fetchedPost.content,
          postOwner: fetchedPost.postOwner,
          isPublic: fetchedPost.isPublic,
          manualAcceting: fetchedPost.manualAcceting,
          acceptingUntil: Number(fetchedPost.acceptingUntil) * 1000,
          creationTime: Number(fetchedPost.creationTime) * 1000,
          totalEarnings: formatEther(fetchedPost.totalEarnings),
          totalResponses: Number(fetchedPost.totalResponses),
          identity: {
            name: fetchedPost.identity.name || "",
            username: fetchedPost.identity.username || "",
            avatarUrl: fetchedPost.identity.avatarUrl || "",
          },
        });

        const fetchedResponses = await contract.getPostResponses(postId);
        setResponses(
          fetchedResponses.map((response: any) => ({
            refPostId: response.refPostId.toString(),
            responseId: response.responseId.toString(),
            responder: response.responder,
            content: response.content,
            amountTransferredInWei: formatEther(
              response.amountTransferredInWei
            ),
            creationTime: Number(response.creationTime) * 1000,
            identity: {
              name: response.identity.name || "",
              username: response.identity.username || "",
              avatarUrl: response.identity.avatarUrl || "",
            },
          }))
        );
      } catch (error) {
        console.error("Error fetching post and responses:", error);
        toast({
          title: "Error",
          description: "Failed to load post and responses. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPostAndResponses();
  }, [contract, params.postId, toast]);

  useEffect(() => {
    setCharacterCount(newResponse.length);
    // Update estimated cost based on response length and Ethereum amount
    const baseCost = 0;
    const lengthCost = (newResponse.length / 1000) * 0.0001;
    const ethAmount = parseFloat(responseAmount) || 0;
    setEstimatedCost((baseCost + lengthCost + ethAmount).toFixed(6));
  }, [newResponse, responseAmount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !walletAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet to submit a response.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const name = !isAnonymous && session?.user?.name ? session.user.name : "";
      const username =
        !isAnonymous && session?.user?.name
          ? session.user.name.replace(/\s+/g, "").toLowerCase()
          : "";
      const avatarUrl =
        !isAnonymous && session?.user?.image ? session.user.image : "";

      const tx = await contract.respondToPost(
        params.postId[0],
        newResponse,
        isAnonymous,
        name,
        username,
        avatarUrl,
        { value: parseEther(estimatedCost) }
      );
      await tx.wait();
      setNewResponse("");
      setResponseAmount("");
      toast({
        title: "Success",
        description: "Your response has been submitted successfully!",
      });
      // Refresh responses
      const updatedResponses = await contract.getPostResponses(
        params.postId[0]
      );
      setResponses(
        updatedResponses.map((response: any) => ({
          refPostId: response.refPostId.toString(),
          responseId: response.responseId.toString(),
          responder: response.responder,
          content: response.content,
          amountTransferredInWei: formatEther(response.amountTransferredInWei),
          creationTime: Number(response.creationTime) * 1000,
          identity: {
            name: response.identity.name || "",
            username: response.identity.username || "",
            avatarUrl: response.identity.avatarUrl || "",
          },
        }))
      );
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!contract || !walletAddress) {
  //     toast({
  //       title: "Error",
  //       description: "Please connect your wallet to submit a response.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const name = !isAnonymous && session?.user?.name ? session.user.name : "";
  //     const username =
  //       !isAnonymous && session?.user?.name
  //         ? session.user.name.replace(/\s+/g, "").toLowerCase()
  //         : "";
  //     const avatarUrl =
  //       !isAnonymous && session?.user?.image ? session.user.image : "";

  //     const tx = await contract.respondToPost(
  //       params.postId[0],
  //       newResponse,
  //       isAnonymous,
  //       name,
  //       username,
  //       avatarUrl,
  //       { value: parseEther(estimatedCost) }
  //     );
  //     await tx.wait();
  //     setNewResponse("");
  //     setResponseAmount("");
  //     toast({
  //       title: "Success",
  //       description: "Your response has been submitted successfully!",
  //     });
  //     // Refresh responses
  //     const updatedResponses = await contract.getPostResponses(
  //       params.postId[0]
  //     );
  //     setResponses(
  //       updatedResponses.map((response: any) => ({
  //         refPostId: response.refPostId.toString(),
  //         responseId: response.responseId.toString(),
  //         responder: response.responder,
  //         content: response.content,
  //         amountTransferredInWei: formatEther(response.amountTransferredInWei),
  //         creationTime: Number(response.creationTime) * 1000,
  //         identity: {
  //           name: response.identity.name || "",
  //           username: response.identity.username || "",
  //           avatarUrl: response.identity.avatarUrl || "",
  //         },
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error submitting response:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to submit response. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleEdit = async () => {
    if (!contract || !walletAddress || !post) return;

    try {
      const tx = await contract.updatePost(
        post.postId,
        editedContent,
        editedIsPublic,
        editedManualAccepting,
        editedManualAccepting
          ? 0
          : Math.floor(new Date(editedAcceptingUntil).getTime() / 1000)
      );
      await tx.wait();
      toast({
        title: "Success",
        description: "Your post has been updated successfully!",
      });
      setIsEditing(false);
      // Refresh post data
      const updatedPost = await contract.posts(params.postId[0]);
      setPost({
        postId: updatedPost.postId.toString(),
        content: updatedPost.content,
        postOwner: updatedPost.postOwner,
        isPublic: updatedPost.isPublic,
        manualAcceting: updatedPost.manualAcceting,
        acceptingUntil: Number(updatedPost.acceptingUntil) * 1000,
        creationTime: Number(updatedPost.creationTime) * 1000,
        totalEarnings: formatEther(updatedPost.totalEarnings),
        totalResponses: Number(updatedPost.totalResponses),
        identity: {
          name: updatedPost.identity.name || "",
          username: updatedPost.identity.username || "",
          avatarUrl: updatedPost.identity.avatarUrl || "",
        },
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!contract || !walletAddress || !post) return;

    try {
      const tx = await contract.deletePost(post.postId);
      await tx.wait();
      toast({
        title: "Success",
        description: "Your post has been deleted successfully!",
      });
      router.push("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // const handleAIAssist = async () => {
  //   setIsAIAssistLoading(true);
  //   try {
  //     const response = await fetch("/api/ai-assist", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: newResponse }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("AI assistance request failed");
  //     }
  //     const data = await response.json();
  //     setNewResponse(
  //       (prevContent) =>
  //         prevContent + (prevContent ? "\n\n" : "") + data.suggestion
  //     );
  //   } catch (error) {
  //     console.error("Error getting AI assistance:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to generate AI response. Please try again.",
  //     });
  //   } finally {
  //     setIsAIAssistLoading(false);
  //   }
  // };
  const handleAIAssist = async () => {
    if (!post) return;

    setIsAIAssistLoading(true);
    try {
      const response = await axios.post("/api/ai-assist-response", {
        postContent: post.content,
        userResponse: newResponse,
      });

      const updatedContent =
        newResponse + (newResponse ? "\n\n" : "") + response.data.suggestion;
      setNewResponse(updatedContent);
      setCharacterCount(updatedContent.length);
      setEstimatedCost(
        (0.001 + (updatedContent.length / 1000) * 0.0001).toFixed(6)
      );

      toast({
        title: "AI Suggestion Added",
        description: "The AI-generated response has been added to your reply.",
      });
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAIAssistLoading(false);
    }
  };

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8 bg-white dark:bg-[#1e2837] text-gray-900 dark:text-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={post.identity.avatarUrl}
                  alt={post.identity.username}
                />
                <AvatarFallback>
                  {post.identity.username
                    ? post.identity.username.charAt(0)
                    : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{post.identity.username || "Anonymous"}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  {formatDistanceToNow(post.creationTime, { addSuffix: true })}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      post.manualAcceting || post.acceptingUntil > Date.now()
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {post.manualAcceting || post.acceptingUntil > Date.now()
                    ? "Accepting responses"
                    : "Not accepting responses"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.totalResponses} responses
            </span>
            <span className="flex items-center">
              <Coins className="w-5 h-5 mr-1" />
              {post.totalEarnings} ETH earned
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {post.postOwner === walletAddress && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete this post?
                      </DialogTitle>
                      <DialogDescription>
                        {/* This action cannot be undone. This will permanently
                        delete your post and no money will be refunded. */}
                        This action is permanent and cannot be undone. Once
                        deleted, your post will be removed from our platform,
                        and no refund will be issued. Please double-check your
                        decision before confirming.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("closeDialog")?.click()
                        }
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied!",
                  description: "Post link has been copied to clipboard.",
                });
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>

      {isEditing && (
        <Card className="mb-8 bg-white dark:bg-[#1e2837] text-gray-900 dark:text-white shadow-lg">
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your post content..."
              className="mb-4 dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] focus:border-blue-500 dark:focus:border-[#3498db]"
            />
            <div className="flex items-center space-x-4 mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="editedIsPublic"
                        checked={editedIsPublic}
                        onCheckedChange={setEditedIsPublic}
                      />
                      <Label
                        htmlFor="editedIsPublic"
                        className="flex items-center cursor-pointer"
                      >
                        {editedIsPublic ? (
                          <Globe className="w-4 h-4 mr-1" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1" />
                        )}
                        {editedIsPublic ? "Public" : "Private"}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {editedIsPublic
                      ? "Your post will be visible to everyone"
                      : "Your post will be private"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="editedManualAccepting"
                  checked={editedManualAccepting}
                  onCheckedChange={setEditedManualAccepting}
                />
                <Label
                  htmlFor="editedManualAccepting"
                  className="cursor-pointer"
                >
                  Manual Accepting
                </Label>
              </div>
              <AnimatePresence>
                {!editedManualAccepting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label
                      htmlFor="editedAcceptingUntil"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Accepting Until
                    </Label>
                    <Input
                      id="editedAcceptingUntil"
                      type="datetime-local"
                      value={editedAcceptingUntil}
                      onChange={(e) => setEditedAcceptingUntil(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      required={!editedManualAccepting}
                      className="w-full dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] focus:border-blue-500 dark:focus:border-[#3498db]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleEdit}
              className="mr-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="mb-8 bg-white dark:bg-[#1e2837] text-gray-900 dark:text-white shadow-lg">
        <CardHeader>
          <CardTitle>Submit Your Response</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Alert className="mb-4 bg-gray-100 dark:bg-[#2c3e50] border-gray-200 dark:border-[#34495e]">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                Submitting a response will incur a platform fee of 0.5% of the
                total Ether sent, with the remainder sent directly to the post
                owner.
              </AlertDescription>
            </Alert>
            <div className="mb-4">
              <Textarea
                placeholder="Type your response here..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={4}
                className="w-full dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] focus:border-blue-500 dark:focus:border-[#3498db]"
              />
              <AnimatePresence>
                {newResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {characterCount} characters
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mb-4">
              <Label htmlFor="responseAmount" className="block mb-2">
                Ethereum Amount
              </Label>
              <Input
                id="responseAmount"
                type="number"
                step="0.000001"
                min="0"
                value={responseAmount}
                onChange={(e) => setResponseAmount(e.target.value)}
                placeholder="Enter ETH amount"
                className="w-full dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e] focus:border-blue-500 dark:focus:border-[#3498db]"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAnonymous"
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                      />
                      <Label
                        htmlFor="isAnonymous"
                        className="flex items-center cursor-pointer"
                      >
                        {isAnonymous ? (
                          <UserX className="w-4 h-4 mr-1" />
                        ) : (
                          <User className="w-4 h-4 mr-1" />
                        )}
                        {isAnonymous ? "Anonymous" : "Show Identity"}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isAnonymous
                      ? "Your identity will be hidden"
                      : "Your identity will be shown"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                onClick={handleAIAssist}
                disabled={isAIAssistLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
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
            <div className="flex justify-between w-full text-sm mb-4">
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#1e2837] text-gray-900 dark:text-white shadow-lg">
        <CardHeader>
          <CardTitle>Previous Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {responses.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No responses yet.
              </p>
            ) : (
              responses.map((response, index) => (
                <motion.div
                  key={response.responseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-6 last:mb-0"
                >
                  <div className="flex items-center space-x-4 mb-2">
                    <Avatar>
                      <AvatarImage
                        src={response.identity.avatarUrl}
                        alt={response.identity.username}
                      />
                      <AvatarFallback>
                        {response.identity.username
                          ? response.identity.username.charAt(0)
                          : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {response.identity.username || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="inline-block w-4 h-4 mr-1" />
                        {formatDistanceToNow(response.creationTime, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {Number(response.amountTransferredInWei) > 0 && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Tipped {response.amountTransferredInWei} ETH
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {response.content}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
