"use client";

import Navbar from "@/components/client/Navbar";
import Sidebar from "@/components/client/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useWallet } from "@/hooks/useWallet";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { ContractProvider } from "@/context/ContractContext";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster } from "@/components/ui/toaster";

interface CurrentUser {
  name: string;
  profilePicture: string;
  walletAddress: string | null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
    walletAddress: null,
  });
  const {
    walletAddress,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    contract,
  } = useWallet();
  const [copied, setCopied] = useState(false);
  const [walletProfilePicture, setWalletProfilePicture] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (session?.user) {
      setCurrentUser({
        name: session.user.name || "Anonymous",
        profilePicture:
          session.user.image ||
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
        walletAddress: null,
      });
    }
  }, [session]);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchWalletProfilePicture(walletAddress).then(setWalletProfilePicture);
      setCurrentUser((prevUser) => ({ ...prevUser, walletAddress }));
    }
  }, [walletAddress]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  const fetchWalletProfilePicture = async (
    address: string
  ): Promise<string> => {
    return `https://api.dicebear.com/6.x/identicon/svg?seed=${address}`;
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
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

  const handleLogout = async () => {
    await signOut();
    handleDisconnectWallet();
  };

  return (
    <ThemeProvider>
      <WalletProvider
        value={{
          walletAddress,
          balance,
          loading,
          error,
          connectWallet: handleConnectWallet,
          disconnectWallet: handleDisconnectWallet,
          contract,
        }}
      >
        <ContractProvider contract={contract}>
          <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar
              currentUser={currentUser}
              connectWallet={handleConnectWallet}
              walletAddress={walletAddress}
              balance={balance}
              loading={loading}
              walletProfilePicture={walletProfilePicture}
              disconnectWallet={handleDisconnectWallet}
              copyAddress={copyAddress}
              openEtherscan={openEtherscan}
              copied={copied}
              error={error}
              toggleSidebar={toggleSidebar}
              logout={handleLogout}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
              <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {children}
              </main>
            </div>
            <Toaster />
          </div>
        </ContractProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}
