import { Clock, Eye, EyeOff, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  stats: {
    totalPosts: number;
    totalResponses: number;
    activePosts: number;
    publicPosts: number;
    privatePosts: number;
    latestResponse: string;
  } | null;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const statItems = [
    {
      label: "Total Posts",
      value: stats?.totalPosts,
      icon: MessageSquare,
      color: "bg-indigo-500",
    },
    {
      label: "Total Responses",
      value: stats?.totalResponses,
      icon: MessageSquare,
      color: "bg-green-500",
    },
    {
      label: "Active Posts",
      value: stats?.activePosts,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Public Posts",
      value: stats?.publicPosts,
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      label: "Private Posts",
      value: stats?.privatePosts,
      icon: EyeOff,
      color: "bg-purple-500",
    },
    {
      label: "Latest Response",
      value: stats?.latestResponse,
      icon: Clock,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${item.color} rounded-md p-3`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.label}
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                    {isLoading ? <Skeleton className="h-9 w-24" /> : item.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
