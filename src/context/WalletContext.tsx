import React, { createContext, useContext } from "react";
import { Contract } from "ethers";

interface WalletContextType {
  walletAddress: string | null;
  balance: string | null;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  contract: Contract | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{
  children: React.ReactNode;
  value: WalletContextType;
}> = ({ children, value }) => {
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
