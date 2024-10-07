"use server";

import { signIn } from "@/auth";

const googleSignin = async () => {
  await signIn("google");
};

export { googleSignin };
