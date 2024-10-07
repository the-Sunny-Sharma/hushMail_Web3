"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { Mail } from "./GLBmodels/Mail";
import Link from "next/link";

interface userDetails {
  name: string;
  email: string;
  avatarUrl: string;
}

interface Props {
  userDetails: userDetails | null;
}
const LandingPage: React.FC<Props> = ({ userDetails }) => {
  const [userInfo, setUserInfo] = useState<userDetails | null>(null);

  useEffect(() => {
    if (userDetails) {
      setUserInfo(userDetails);
    }
  }, [userDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      <header className="p-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">HushMail</h1>

          <div className="space-x-4">
            {userInfo ? (
              <Link
                href="/dashboard"
                className="bg-white rounded-md text-black px-2 py-1 hover:bg-gray-600 hover:text-white"
              >
                <span>Welcome, {userInfo.name}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white rounded-md text-black px-2 py-1 hover:bg-gray-600 hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <div className="h-[200px] w-[200px]">
        <Canvas>
          <Environment preset="studio" />
          <OrbitControls />
          <Mail />
        </Canvas>
      </div>
    </div>
  );
};

export default LandingPage;
