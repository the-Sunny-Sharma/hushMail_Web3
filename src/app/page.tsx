// import LandingPage from "@/components/client/LandingPage";
// import { auth } from "@/auth";

// export default async function Home() {
//   const session = await auth();
//   let userDetails = null;
//   if (session?.user) {
//     console.log(`USER SESSION: ${session.user.email}`);
//     userDetails = {
//       name: session.user.name ?? "",
//       email: session.user.email ?? "",
//       avatarUrl: session.user.image ?? "",
//     };
//   }

//   return <LandingPage userDetails={userDetails} />;
// }
"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LockIcon,
  UnlockIcon,
  ShieldIcon,
  Zap,
  Server,
  Users,
  LogOut,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();
  const { scrollYProgress } = useScroll();
  const featuresRef = useRef(null);
  const architectureRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isArchitectureInView = useInView(architectureRef, {
    once: true,
    amount: 0.2,
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.8, 1]),
    springConfig
  );

  const features = [
    {
      icon: LockIcon,
      title: "End-to-End Encryption",
      description: "Your messages are secure from sender to recipient.",
    },
    {
      icon: UnlockIcon,
      title: "Decentralized Storage",
      description: "No central server holds your data, enhancing privacy.",
    },
    {
      icon: ShieldIcon,
      title: "Anonymous Messaging",
      description: "Communicate without revealing your identity.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience rapid message delivery and minimal latency.",
    },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">HushMail</h1>
        <nav>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-4">
              <Button variant="outline" onClick={() => signIn()}>
                Login
              </Button>
              <Link href="/signup" passHref>
                <Button as="a">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Secure, Private, and Fast Messaging
            </h2>
            <p className="text-xl mb-8">
              Experience the future of communication with HushMail
            </p>
            <Button size="lg">Get Started</Button>
          </motion.div>
        </section>

        <motion.section
          ref={featuresRef}
          className="container mx-auto px-4 py-20"
          style={{ opacity, scale }}
        >
          <h3 className="text-3xl font-bold mb-10 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={architectureRef}
          className="container mx-auto px-4 py-20"
          style={{ opacity, scale }}
        >
          <h3 className="text-3xl font-bold mb-10 text-center">
            Our Architecture
          </h3>
          <div className="bg-gray-800 p-8 rounded-lg">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isArchitectureInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Server className="w-24 h-24 mb-6 text-blue-500" />
              <h4 className="text-2xl font-semibold mb-4">
                Decentralized Network
              </h4>
              <p className="text-center mb-8">
                Our platform utilizes a distributed network of nodes to ensure
                maximum privacy and security.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isArchitectureInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Users className="w-16 h-16 mb-4 text-green-500" />
                  <p>Peer-to-Peer Messaging</p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isArchitectureInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <ShieldIcon className="w-16 h-16 mb-4 text-yellow-500" />
                  <p>End-to-End Encryption</p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isArchitectureInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Zap className="w-16 h-16 mb-4 text-purple-500" />
                  <p>Fast Message Routing</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
