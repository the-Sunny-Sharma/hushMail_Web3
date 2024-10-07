"use server";

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { AuthProviderClient } from "./AuthProviderClient"; // Import the client provider
import { User } from "@/types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const cookees = cookies().get("authjs.session-token");
  const secret = process.env.NEXT_PUBLIC_AUTH_SECRET;

  let user = null;

  if (cookees && secret) {
    user = (await decode({
      token: cookees.value,
      salt: cookees.name,
      secret: secret,
    })) as User;
  }

  // Pass the user to the client provider
  return <AuthProviderClient user={user}>{children}</AuthProviderClient>;
};
