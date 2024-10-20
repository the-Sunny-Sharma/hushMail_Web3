"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrowserProvider, formatEther } from "ethers";

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "HushMail Team",
    content:
      "Welcome to HushMail! We're excited to have you join our secure and anonymous feedback platform.",
    timestamp: "2024-03-01T12:00:00Z",
  },
  {
    id: "2",
    author: "HushMail Team",
    content:
      "Our blockchain-based system ensures your feedback remains confidential and tamper-proof.",
    timestamp: "2024-03-02T14:30:00Z",
  },
  {
    id: "3",
    author: "HushMail Team",
    content:
      "Don't forget to set up your anonymous profile to start sharing and receiving feedback!",
    timestamp: "2024-03-03T09:15:00Z",
  },
  {
    id: "4",
    author: "Sarah K.",
    content:
      "HushMail has transformed how we handle feedback in our organization. It's truly revolutionary!",
    timestamp: "2024-03-04T16:45:00Z",
  },
  {
    id: "5",
    author: "Alex M.",
    content:
      "I love how HushMail prioritizes user privacy. It's refreshing to see a platform that truly cares about its users.",
    timestamp: "2024-03-05T11:20:00Z",
  },
];

interface UserDetails {
  name: string;
  email: string;
  avatarUrl: string;
}

interface Props {
  userDetails: UserDetails | null;
}

const ClientPage: React.FC<Props> = ({ userDetails }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletProfilePicture, setWalletProfilePicture] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [posts.length]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        setBalance(formatEther(balance));
      }
    };

    const intervalId = setInterval(fetchBalance, 10000);

    return () => clearInterval(intervalId);
  }, [walletAddress]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(formatEther(balance));
        const profilePic = await fetchWalletProfilePicture(address);
        setWalletProfilePicture(profilePic);
      } catch (error) {
        setError("Failed to connect wallet. Please try again.");
        console.error("Failed to connect wallet:", error);
      } finally {
        setLoading(false);
      }
    } else {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        const dappUrl = encodeURIComponent(
          `${window.location.hostname}${window.location.pathname}`
        );
        window.open(`https://metamask.app.link/dapp/${dappUrl}`);
      } else {
        setError("Please install MetaMask!");
      }
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    if (walletAddress) {
      window.open(
        `https://sepolia.etherscan.io/address/${walletAddress}`,
        "_blank"
      );
    }
  };

  const fetchWalletProfilePicture = async (
    address: string
  ): Promise<string> => {
    return `https://api.dicebear.com/6.x/identicon/svg?seed=${address}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                HushMail
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                          className="flex items-center space-x-1 sm:space-x-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                        >
                          <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{`${walletAddress.slice(
                            0,
                            6
                          )}...${walletAddress.slice(-4)}`}</span>
                          <span className="sm:hidden">{`${walletAddress.slice(
                            0,
                            4
                          )}...${walletAddress.slice(-2)}`}</span>
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 sm:w-60 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <div className="space-y-2">
                          <div className="font-medium">Wallet Actions</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-700 dark:text-gray-300"
                            onClick={copyAddress}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? "Copied!" : "Copy Address"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-700 dark:text-gray-300"
                            onClick={openEtherscan}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Etherscan
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-500 dark:text-red-400"
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
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
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
                          <TooltipContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                    >
                      {loading ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-1 sm:space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
                  >
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{error}</span>
                    <span className="sm:hidden">Error</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {userDetails ? (
                <div className="flex flex-row items-center">
                  <p className="mr-2 text-gray-900 dark:text-white text-xs sm:text-sm">
                    Welcome,{" "}
                    <span className="font-semibold">{userDetails.name}</span>
                  </p>
                  <Image
                    src={
                      userDetails.avatarUrl ||
                      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-xs sm:text-sm font-medium text-white rounded-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden h-48 sm:h-64">
            <AnimatePresence mode="wait">
              {posts.map((post, index) =>
                index === currentPostIndex ? (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 sm:p-6 h-full flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-sm sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-4 h-4 mr-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span>
                        {formatDistanceToNow(new Date(post.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/homepage"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Continue to Your Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientPage;
