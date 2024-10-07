"use client";

import { User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderClient: React.FC<{
  user: User | null;
  children: React.ReactNode;
}> = ({ user: initialUser, children }) => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    // Here, you could also add logic to update the user if needed.
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProviderClient");
  }
  return context;
};
