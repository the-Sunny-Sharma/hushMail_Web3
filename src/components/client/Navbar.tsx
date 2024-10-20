"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Sun,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface CurrentUser {
  name: string;
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
  error: string | null;
  toggleSidebar: () => void;
  logout: () => void;
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
  error,
  toggleSidebar,
  logout,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const titles: { [key: string]: string } = {
    "/homepage": "Home",
    "/dashboard": "Dashboard",
    "/create-post": "Create Post",
    "/settings": "Settings",
    "/messages": "Messages",
  };

  const title =
    titles[pathname] || (pathname.startsWith("/posts") && "Post Details");

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {title && <h1 className="text-xl font-bold">{title}</h1>}
          </div>
          <div className="flex items-center space-x-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hidden sm:flex items-center space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-md"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Image
                    src={
                      currentUser.profilePicture ??
                      "/default-profile-picture.jpg"
                    }
                    alt="User profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.walletAddress
                        ? `${currentUser.walletAddress.slice(
                            0,
                            6
                          )}...${currentUser.walletAddress.slice(-4)}`
                        : "No wallet connected"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}

                  <span>Toggle theme</span>
                </DropdownMenuItem>
                {walletAddress ? (
                  <>
                    <DropdownMenuItem onClick={copyAddress}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>{copied ? "Copied!" : "Copy wallet address"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openEtherscan}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>View on Etherscan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={disconnectWallet}>
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Disconnect wallet</span>
                    </DropdownMenuItem>
                    {balance && (
                      <DropdownMenuLabel>
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                          <span>{`${parseFloat(balance).toFixed(4)} ETH`}</span>
                        </div>
                      </DropdownMenuLabel>
                    )}
                  </>
                ) : (
                  <DropdownMenuItem onClick={connectWallet} disabled={loading}>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>{loading ? "Connecting..." : "Connect wallet"}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
