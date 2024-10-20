"use client";

import React from "react";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  PlusCircle,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const navItems = [
    { href: "/homepage", icon: Home, label: "Home" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/create-post", icon: PlusCircle, label: "Create Feed" },
    // { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">HushMail</h2>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.href
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="hidden md:block fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg"
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
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md ${
                    pathname === item.href
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
}
