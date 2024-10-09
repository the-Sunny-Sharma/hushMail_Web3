import { BrowserProvider, Contract, formatEther } from "ethers";
import { useState } from "react";
import abi from "@/contract/HushmailContractv2.json";

// Custom hook for wallet management
const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null); // State for contract instance

  const connectWallet = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
    const contractABI = abi.abi;

    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(formatEther(balance));

        // Create a contract instance
        const contractInstance = new Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance); // Store the contract instance in state

        console.log("Connected account:", address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please install MetaMask!");
    }
  };

  return {
    walletAddress,
    balance,
    loading,
    error,
    connectWallet,
    contract, // Expose contract instance
  };
};

export { useWallet };
