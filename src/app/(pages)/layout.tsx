"use client";

import Navbar from "@/components/client/Navbar";
import Sidebar from "@/components/client/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import * as ethers from "ethers";
import { useEffect, useState } from "react";

interface CurrentUser {
  username: string;
  profilePicture: string;
  walletAddress: string | null;
}

// export default function HomeLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState<CurrentUser>({
//     username: "",
//     profilePicture:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
//     walletAddress: null,
//   });
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [balance, setBalance] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [walletProfilePicture, setWalletProfilePicture] = useState<
//     string | null
//   >(null);

//   const { theme } = useTheme();

//   useEffect(() => {
//     const savedSidebarState = localStorage.getItem("sidebarOpen");
//     if (savedSidebarState !== null) {
//       setIsSidebarOpen(JSON.parse(savedSidebarState));
//     }
//   }, []);

//   useEffect(() => {
//     // Simulating user authentication
//     // In a real app, you'd fetch this from your authentication service
//     setCurrentUser((prevUser) => ({
//       ...prevUser,
//       username: "demo@example.com",
//     }));
//   }, []);

//   const toggleSidebar = () => {
//     const newState = !isSidebarOpen;
//     setIsSidebarOpen(newState);
//     localStorage.setItem("sidebarOpen", JSON.stringify(newState));
//   };

//   // Mock function to fetch wallet profile picture
//   const fetchWalletProfilePicture = async (
//     address: string
//   ): Promise<string> => {
//     // In a real implementation, you would fetch the profile picture associated with the wallet address
//     // For now, we'll return a placeholder image
//     return `https://api.dicebear.com/6.x/identicon/svg?seed=${address}`;
//   };

//   const connectWallet = async () => {
//     if (typeof window.ethereum !== "undefined") {
//       try {
//         setLoading(true);
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();
//         setWalletAddress(address);
//         const balance = await provider.getBalance(address);
//         setBalance(ethers.utils.formatEther(balance));
//         // Fetch wallet profile picture (this is a mock function, replace with actual implementation)
//         const profilePic = await fetchWalletProfilePicture(address);
//         setWalletProfilePicture(profilePic);
//         setCurrentUser((prevUser) => ({ ...prevUser, walletAddress: address }));
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to connect wallet:", error);
//         setError("Failed to connect wallet. Please try again.");
//         setLoading(false);
//       }
//     } else {
//       setError("Please install MetaMask!");
//     }
//   };

//   const disconnectWallet = () => {
//     setWalletAddress(null);
//     setBalance(null);
//     setWalletProfilePicture(null);
//     setCurrentUser((prevUser) => ({ ...prevUser, walletAddress: null }));
//   };

//   const copyAddress = () => {
//     if (walletAddress) {
//       navigator.clipboard.writeText(walletAddress);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const openEtherscan = () => {
//     if (walletAddress) {
//       window.open(`https://etherscan.io/address/${walletAddress}`, "_blank");
//     }
//   };

//   return (
//     <ThemeProvider>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
//         <div
//           className={`flex min-h-screen ${
//             theme === "dark"
//               ? "bg-gray-900 text-white"
//               : "bg-gray-100 text-gray-900"
//           }`}
//         >
//           <Sidebar
//             isSidebarOpen={isSidebarOpen}
//             toggleSidebar={toggleSidebar}
//           />
//           <div
//             className={`flex-1 transition-all duration-300 ease-in-out ${
//               isSidebarOpen ? "md:ml-60" : "md:ml-16"
//             }`}
//           >

//             <main className="p-4">{children}</main>
//           </div>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
    walletAddress: null,
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
        // Fetch wallet profile picture (this is a mock function, replace with actual implementation)
        const profilePic = await fetchWalletProfilePicture(address);
        setWalletProfilePicture(profilePic);
        setCurrentUser((prevUser) => ({ ...prevUser, walletAddress: address }));
        setLoading(false);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
        setLoading(false);
      }
    } else {
      setError("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
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
            connectWallet={connectWallet}
            walletAddress={walletAddress}
            balance={balance}
            loading={loading}
            walletProfilePicture={walletProfilePicture}
            disconnectWallet={disconnectWallet}
            copyAddress={copyAddress}
            openEtherscan={openEtherscan}
            copied={copied}
          />
          <main className="flex-grow overflow-auto p-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
