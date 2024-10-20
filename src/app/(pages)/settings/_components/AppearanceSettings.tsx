import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

interface AppearanceSettingsProps {
  theme: string;
  toggleTheme: () => void;
}

export function AppearanceSettings({
  theme,
  toggleTheme,
}: AppearanceSettingsProps) {
  return (
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
  );
}
