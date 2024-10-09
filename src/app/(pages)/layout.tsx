"use client";

import Navbar from "@/components/client/Navbar";
import Sidebar from "@/components/client/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";

interface CurrentUser {
  username: string;
  profilePicture: string;
  walletAddress: string | null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
    walletAddress: null,
  });
  const { walletAddress, balance, loading, error, connectWallet, contract } =
    useWallet();
  const [copied, setCopied] = useState(false);
  const [walletProfilePicture, setWalletProfilePicture] = useState<
    string | null
  >(null);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  useEffect(() => {
    // Simulating user authentication
    // In a real app, you'd fetch this from your authentication service
    setCurrentUser((prevUser) => ({
      ...prevUser,
      username: "demo@example.com",
    }));
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  // Mock function to fetch wallet profile picture
  const fetchWalletProfilePicture = async (
    address: string
  ): Promise<string> => {
    // In a real implementation, you would fetch the profile picture associated with the wallet address
    // For now, we'll return a placeholder image
    return `https://api.dicebear.com/6.x/identicon/svg?seed=${address}`;
  };

  const handleConnectWallet = async () => {
    await connectWallet();

    if (walletAddress) {
      const profilePic = await fetchWalletProfilePicture(walletAddress);
      setWalletProfilePicture(profilePic);
      setCurrentUser((prevUser) => ({ ...prevUser, walletAddress }));
    }
  };

  const disconnectWallet = () => {
    setWalletProfilePicture(null);
    setCurrentUser((prevUser) => ({ ...prevUser, walletAddress: null }));
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
      window.open(`https://etherscan.io/address/${walletAddress}`, "_blank");
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Navbar
            currentUser={currentUser}
            connectWallet={handleConnectWallet}
            walletAddress={walletAddress}
            balance={balance}
            loading={loading}
            walletProfilePicture={walletProfilePicture}
            disconnectWallet={disconnectWallet}
            copyAddress={copyAddress}
            openEtherscan={openEtherscan}
            copied={copied}
            error={error}
          />
          <main className="flex-grow overflow-auto p-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
