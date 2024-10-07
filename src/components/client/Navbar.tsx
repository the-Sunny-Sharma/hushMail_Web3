"use client";

import {
  ArrowLeft,
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

interface CurrentUser {
  username: string;
  profilePicture: string;
  walletAddress: string | null;
}

interface NavbarProps {
  currentUser: CurrentUser;
  connectWallet: () => Promise<void>;
  walletAddress: string | null;
  balance: string | null;
  loading: boolean;
  walletProfilePicture: string | null;
  disconnectWallet: () => void;
  copyAddress: () => void;
  openEtherscan: () => void;
  copied: boolean;
}

export default function Navbar({
  currentUser,
  connectWallet,
  walletAddress,
  balance,
  loading,
  walletProfilePicture,
  disconnectWallet,
  copyAddress,
  openEtherscan,
  copied,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const titles: { [key: string]: string } = {
    "/h/home": "Home",
    "/h/dashboard": "Dashboard",
    "/h/create-feed": "Create Feed",
  };

  const title =
    titles[pathname] ||
    (pathname.startsWith("/h/publicPost") && "Post Details");

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AnimatePresence mode="wait">
              {walletAddress ? (
                <motion.div
                  key="wallet-info"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>{`${walletAddress.slice(
                          0,
                          6
                        )}...${walletAddress.slice(-4)}`}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                      <div className="space-y-2">
                        <div className="font-medium">Wallet Actions</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={copyAddress}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copied ? "Copied!" : "Copy Address"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={openEtherscan}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Etherscan
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-500"
                          onClick={disconnectWallet}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {balance && walletProfilePicture && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative w-10 h-10">
                            <Image
                              src={walletProfilePicture}
                              alt="Wallet Profile"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <svg
                              className="absolute inset-0 w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="10"
                                strokeDasharray={`${
                                  Math.min(parseFloat(balance) * 10, 100) *
                                  2.827
                                }, 1000`}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{`${parseFloat(balance).toFixed(4)} ETH`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="connect-wallet"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={connectWallet}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {loading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-sm font-medium">{currentUser.username}</span>
            <Image
              src={currentUser.profilePicture}
              alt="User profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
