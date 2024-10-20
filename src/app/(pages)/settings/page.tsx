"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ProfileSettings } from "./_components/ProfileSettings";
import { AccountSettings } from "./_components/AccountSettings";
import { NotificationSettings } from "./_components/NotificationSettings";
import { AppearanceSettings } from "./_components/AppearanceSettings";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    profilePicture: "",
    notifications: {
      email: false,
      push: false,
    },
  });

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        profilePicture: session.user.image || "",
        notifications: {
          // email: session.user.emailNotifications || false,
          // push: session.user.pushNotifications || false,
          email: false,
          push: false,
        },
      });
    }
  }, [session]);

  const handleUpdateSession = async () => {
    await update();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-gray-300 dark:bg-[#2c3e50] flex flex-wrap justify-center sm:justify-start">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#4c6984]"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#4c6984]"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#4c6984]"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#4c6984]"
          >
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings
            userData={userData}
            setUserData={setUserData}
            updateSession={handleUpdateSession}
          />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            notifications={userData.notifications}
            setUserData={setUserData}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings theme={theme} toggleTheme={toggleTheme} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
