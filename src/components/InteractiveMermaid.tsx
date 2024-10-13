"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { X } from "lucide-react";

interface InteractiveMermaidProps {
  chart: string;
}

export default function InteractiveMermaid({ chart }: InteractiveMermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [nodeInfo, setNodeInfo] = useState<{ [key: string]: string }>({
    UI: "User Interface: The main point of interaction for users with the HushMail application.",
    WC: "Wallet Connection: Allows users to connect their Ethereum wallets for secure transactions.",
    TM: "Theme Manager: Handles the application's visual themes and appearance customization.",
    NA: "NextAuth v5: Provides secure authentication for the application.",
    PC: "Post Contract: Manages posts, responses, and associated operations on the blockchain.",
    ETH: "Ethereum Network: The blockchain platform that powers HushMail's decentralized features.",
    API: "API Server: Handles requests between the client and the backend services.",
    MA: "MongoDB Atlas: Used for storing user data and other non-blockchain information.",
    IPFS: "IPFS Storage: InterPlanetary File System used for decentralized storage of larger files and data.",
    ES: "Etherscan: Integration allows users to verify blockchain transactions easily.",
    AI: "AI Assistant: Provides intelligent support and features within the application.",
    CP: "Create Post: Function allows users to publish new messages on the platform.",
    RP: "Respond to Post: Function enables users to reply to existing posts.",
    GP: "Get Posts: Functions retrieve posts with pagination and filtering options.",
    GR: "Get Responses: Functions fetch responses for specific posts with pagination.",
    UP: "Update Post: Function allows post owners to modify their existing posts.",
    DP: "Delete Post: Function enables post owners to remove their posts from the platform.",
    PF: "Platform Fees: Collected for post creation and response actions.",
    ID: "Identity Management: Handles user profiles and anonymous posting options.",
    PM: "Post Management: Oversees the lifecycle of posts including creation, updating, and deletion.",
    RM: "Response Management: Manages the creation and retrieval of responses to posts.",
    FM: "Fee Management: Handles the collection and distribution of platform fees.",
    UM: "User Management: Manages user accounts, profiles, and authentication.",
    DM: "Data Management: Oversees the storage and retrieval of application data.",
    BM: "Blockchain Management: Handles interactions with the Ethereum blockchain.",
    SM: "Storage Management: Manages decentralized file storage using IPFS.",
    EM: "External Management: Handles interactions with external services like Etherscan and AI.",
  });

  useEffect(() => {
    setIsClient(true);
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Arial, sans-serif",
      fontSize: 14,
      flowchart: {
        nodeSpacing: 30,
        rankSpacing: 80,
        curve: "basis",
      },
    });
  }, []);

  useEffect(() => {
    if (isClient && ref.current) {
      renderChart();
    }
  }, [chart, isClient]);

  useEffect(() => {
    if (showInfo && !isHovering) {
      closeTimeoutRef.current = setTimeout(() => {
        setShowInfo(false);
        setSelectedNode(null);
      }, 5000);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [showInfo, isHovering]);

  const renderChart = async () => {
    if (ref.current) {
      ref.current.innerHTML = "";
      try {
        const { svg } = await mermaid.render("mermaid-svg", chart);
        ref.current.innerHTML = svg;

        // Add click events to nodes
        const nodes = ref.current.querySelectorAll(".node");
        nodes.forEach((node) => {
          node.addEventListener("click", (e) => {
            const nodeId = (e.currentTarget as SVGElement).id;
            // Extract the node name from the id (remove "flowchart-" prefix and any trailing numbers)
            const nodeName = nodeId.replace(/flowchart-([A-Z]+)-?\d*/, "$1");
            setSelectedNode(nodeName);
            setShowInfo(true);
          });
        });

        // Adjust SVG viewBox to fit content
        const svgElement = ref.current.querySelector("svg");
        if (svgElement) {
          const bbox = svgElement.getBBox();
          svgElement.setAttribute(
            "viewBox",
            `${bbox.x - 20} ${bbox.y - 20} ${bbox.width + 40} ${
              bbox.height + 40
            }`
          );
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
        }
      } catch (error) {
        console.error("Error rendering Mermaid chart:", error);
        ref.current.innerHTML = "<p>Error rendering chart</p>";
      }
    }
  };

  const handleClose = () => {
    setShowInfo(false);
    setSelectedNode(null);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (showInfo) {
      closeTimeoutRef.current = setTimeout(() => {
        setShowInfo(false);
        setSelectedNode(null);
      }, 5000);
    }
  };

  if (!isClient) {
    return (
      <div className="h-96 flex items-center justify-center text-white">
        Loading diagram...
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={ref} className="mermaid overflow-x-auto min-h-[500px] w-full" />
      <AnimatePresence>
        {showInfo && selectedNode && (
          <Draggable
            handle=".handle"
            bounds="parent"
            defaultPosition={{ x: 0, y: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-900 rounded-lg shadow-lg p-4 max-w-md w-full border border-blue-500"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex justify-between items-center mb-2 handle cursor-move">
                <h4 className="text-lg font-semibold text-white">
                  {selectedNode}
                </h4>
                <button
                  onClick={handleClose}
                  className="text-gray-300 hover:text-white focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300">
                {nodeInfo[selectedNode] ||
                  "No information available for this component."}
              </p>
            </motion.div>
          </Draggable>
        )}
      </AnimatePresence>
    </div>
  );
}
