import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    push: boolean;
  };
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

export function NotificationSettings({
  notifications,
  setUserData,
}: NotificationSettingsProps) {
  const handleNotificationChange = async (
    type: "email" | "push",
    checked: boolean
  ) => {
    try {
      const response = await fetch("/api/update-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [type]: checked }),
      });

      if (response.ok) {
        setUserData((prev) => ({
          ...prev,
          notifications: { ...prev.notifications, [type]: checked },
        }));
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${
            checked ? "enabled" : "disabled"
          }`
        );
      } else {
        toast.error(`Failed to update ${type} notifications`);
      }
    } catch (error) {
      console.error(`Error updating ${type} notifications:`, error);
      toast.error(`An error occurred while updating ${type} notifications`);
    }
  };

  return (
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
              handleNotificationChange("email", checked)
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
              handleNotificationChange("push", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
