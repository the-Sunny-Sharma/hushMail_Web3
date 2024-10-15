"use client";

import React, { useRef, useState } from "react";
import InteractiveMermaid from "@/components/InteractiveMermaid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EthereumLogo } from "@/components/client/GLBmodels/EthereumLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Code,
  Database,
  FileText,
  Globe,
  LockIcon,
  LogOut,
  ShieldIcon,
  UnlockIcon,
  UserCheck,
  Zap,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const GridBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="h-full w-full bg-gray-900 bg-opacity-50">
      <div className="h-full w-full custom-grid relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-900 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
      </div>
    </div>
  </div>
);

const TechStack = [
  {
    icon: Code,
    name: "Next.js",
    description: "React framework for server-side rendering",
  },
  {
    icon: Database,
    name: "MongoDB",
    description: "NoSQL database for flexible data storage",
  },
  {
    icon: Globe,
    name: "Ethereum",
    description: "Blockchain platform for smart contracts",
  },
  {
    icon: FileText,
    name: "IPFS",
    description: "Distributed file system for content storage",
  },
  {
    icon: LockIcon,
    name: "NextAuth",
    description: "Authentication for Next.js applications",
  },
  {
    icon: Zap,
    name: "Framer Motion",
    description: "Animation library for React",
  },
];

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const featuresRef = useRef(null);
  const architectureRef = useRef(null);
  const techStackRef = useRef(null);
  const modelRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isArchitectureInView = useInView(architectureRef, {
    once: true,
    amount: 0.2,
  });
  const isTechStackInView = useInView(techStackRef, {
    once: true,
    amount: 0.2,
  });
  const isModelInView = useInView(modelRef, { once: true, amount: 0.2 });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.8, 1]),
    springConfig
  );

  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: LockIcon,
      title: "Anonymous Feedback",
      description: "Share your thoughts without revealing your identity.",
    },
    {
      icon: UnlockIcon,
      title: "Decentralized Storage",
      description: "Your feedback is stored securely on the blockchain.",
    },
    {
      icon: ShieldIcon,
      title: "End-to-End Encryption",
      description: "Your messages are encrypted from sender to recipient.",
    },
    {
      icon: UserCheck,
      title: "Verified Responses",
      description: "Ensure authenticity with blockchain-verified responses.",
    },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/90 to-gray-800/90 text-white overflow-x-hidden">
      <GridBackground />
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold">HushMail</h1>
        <nav>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={session.user?.image || "/default-profile-picture.jpg"}
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-4 text-black">
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Link href="/signup" passHref>
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Secure, Anonymous Feedback Platform
            </h2>
            <p className="text-xl mb-8">
              Experience the future of feedback with HushMail
            </p>
            <Button size="lg" onClick={() => router.push("/h")}>
              Get Started
            </Button>
          </motion.div>
        </section>

        <motion.section
          ref={featuresRef}
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ opacity, scale }}
        >
          <h3 className="text-3xl font-bold mb-10 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
                {hoveredFeature === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-blue-400"
                  >
                    Learn more →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={modelRef}
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ opacity, scale }}
        >
          <h3 className="text-4xl font-bold mb-10 text-center text-white">
            Immerse Yourself in HushMail
          </h3>
          <motion.div
            className="h-[400px] bg-gray-900 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isModelInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <EthereumLogo />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </motion.div>
          <p className="text-center mt-6 text-gray-300 text-lg">
            Step into the world of HushMail and discover how our platform works.
          </p>
        </motion.section>

        <motion.section
          ref={architectureRef}
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ opacity, scale }}
        >
          <h3 className="text-3xl font-bold mb-10 text-center">
            System Architecture
          </h3>
          <div className="bg-gray-800 p-8 rounded-lg">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isArchitectureInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full max-w-[86rem] mx-auto">
                <InteractiveMermaid
                  chart={`
                  %%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#3498db', 'primaryTextColor': '#fff', 'primaryBorderColor': '#2980b9', 'lineColor': '#2980b9', 'secondaryColor': '#2ecc71', 'tertiaryColor': '#e74c3c' }}}%%
                  graph TB
                    subgraph "Client-Side"
                      UI["🖥️ User Interface"]
                      WC["👛 Wallet Connection"]
                      TM["🎨 Theme Manager"]
                    end

                    subgraph "Authentication"
                      NA["🔐 NextAuth v5"]
                    end

                    subgraph "Smart Contracts"
                      PC["📝 Post Contract"]
                      subgraph "Feedback Management"
                        direction TB
                        FM["📊 Feedback Management"]
                        CF["✍️ Create Feedback"]
                        UF["✏️ Update Feedback"]
                        DF["🗑️ Delete Feedback"]
                        GF["📚 Get Feedback"]
                      end
                      subgraph "Response Management"
                        direction TB
                        RM["💬 Response Management"]
                        RF["🗨️ Respond to Feedback"]
                        GR["📥 Get Responses"]
                      end
                      subgraph "Platform Management"
                        direction TB
                        FEM["💰 Fee Management"]
                        PF["💲 Platform Fees"]
                        ID["🎭 Identity Management"]
                      end
                    end

                    subgraph "Blockchain"
                      ETH["⛓️ Ethereum Network"]
                    end

                    subgraph "Backend Services"
                      API["🚀 API Server"]
                      subgraph "Data Management"
                        direction TB
                        DM["🗄️ Data Management"]
                        MA["🍃 MongoDB Atlas"]
                        SM["📦 Storage Management"]
                        IPFS["📂 IPFS Storage"]
                      end
                    end

                    subgraph "External Services"
                      EM["🌐 External Management"]
                      ES["🔍 Etherscan"]
                      AI["🤖 AI Assistant"]
                    end

                    UI --> WC
                    UI --> TM
                    UI <--> API
                    UI <--> NA
                    WC <--> ETH
                    PC <--> ETH
                    API <--> DM
                    NA <--> UM
                    UI --> ES
                    UI <--> AI

                    PC --> FM
                    PC --> RM
                    PC --> FEM

                    FM --> CF
                    FM --> UF
                    FM --> DF
                    FM --> GF
                    RM --> RF
                    RM --> GR
                    FEM --> PF
                    FEM --> ID

                    DM --> MA
                    DM --> SM
                    SM --> IPFS

                    EM --> ES
                    EM --> AI

                    classDef primary fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
                    classDef secondary fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
                    classDef tertiary fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff;
                    classDef quaternary fill:#f39c12,stroke:#d35400,stroke-width:2px,color:#fff;

                    class UI,WC,TM primary;
                    class PC,FM,RM,FEM,CF,RF,GF,GR,UF,DF,PF,ID secondary;
                    class ETH tertiary;
                    class API,DM,MA,SM,IPFS,NA,UM,EM quaternary;
                    class ES,AI quaternary;
                `}
                />
              </div>
              <p className="text-center mt-8 text-gray-300">
                Our decentralized architecture ensures maximum privacy,
                security, and performance for anonymous feedback. Click on each
                component to learn more!
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          ref={techStackRef}
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ opacity, scale }}
        >
          <h3 className="text-3xl font-bold mb-10 text-center">
            Our Tech Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TechStack.map((tech, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isTechStackInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <tech.icon className="w-12 h-12 mb-4 text-blue-500" />
                <h4 className="text-xl font-semibold mb-2">{tech.name}</h4>
                <p className="text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <footer className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">HushMail</h4>
              <p className="text-gray-400">
                Secure, anonymous feedback platform built on blockchain
                technology.{" "}
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Team Members</h4>
              <ul className="text-gray-400">
                <li>Sunny Sharma</li>
                <li>Ganesh Jha</li>
                <li>Rushi Kharat</li>
                <li>Bhushan Patil</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Guidance</h4>
              <p className="text-gray-400">
                Under the guidance of Prof. Sanketi Raut
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Important Links</h4>
              <ul className="text-gray-400">
                <li>
                  <a href="/research-papers" className="hover:text-white">
                    Research Paper
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/the-Sunny-Sharma/hushMail_Web3"
                    className="hover:text-white"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 py-4">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 HushMail. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
