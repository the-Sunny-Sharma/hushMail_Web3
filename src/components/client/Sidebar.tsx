"use client";

import React from "react";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 240 : 64 }}
      className="fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isSidebarOpen && <h2 className="text-xl font-semibold">HushMail</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      <nav className="p-2">
        <ul className="space-y-2">
          <li>
            <Link
              href="/homepage"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/homepage"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/dashboard"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/create-post"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/create-post"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Create Feed</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/settings"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </motion.aside>
  );
}
