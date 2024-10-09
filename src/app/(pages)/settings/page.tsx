"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import { Key, Moon, Save, Sun, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { walletAddress } = useWallet();
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("john@example.com");
  const [profilePicture, setProfilePicture] = useState("/placeholder-user.jpg");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not implemented in this demo");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-gray-300 dark:bg-[#2c3e50]">
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
            // className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#34495e]"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#4c6984]"
          >
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-white dark:bg-[#1e2837]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePicture} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="cursor-pointer dark:bg-[#2c3e50] text-gray-900 dark:text-white"
                >
                  <Input
                    type="file"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                  />
                  <Upload className="w-4 h-4 mr-2" />
                  Change Picture
                </Button>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="bg-white dark:bg-[#1e2837]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Connected Wallet
                </Label>
                <Input
                  value={walletAddress || "Not connected"}
                  readOnly
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="current-password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
                />
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-white dark:bg-[#1e2837]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="email-notifications"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="push-notifications"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-white dark:bg-[#1e2837]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="theme-toggle"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Dark Mode
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
