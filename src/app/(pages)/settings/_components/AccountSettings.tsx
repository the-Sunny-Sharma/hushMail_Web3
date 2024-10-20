import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/hooks/useWallet";
import { Key, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function AccountSettings() {
  const { walletAddress } = useWallet();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing password");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/delete-account", {
          method: "POST",
        });

        if (response.ok) {
          toast.success("Account deleted successfully");
          signOut({ callbackUrl: "/" });
        } else {
          toast.error("Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("An error occurred while deleting account");
      }
    }
  };

  return (
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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="dark:bg-[#2c3e50] text-gray-900 dark:text-white border-gray-300 dark:border-[#34495e]"
          />
        </div>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleChangePassword}
        >
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
  );
}
