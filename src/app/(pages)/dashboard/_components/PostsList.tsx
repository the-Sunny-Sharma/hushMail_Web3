import Link from "next/link";
import { Clock, MessageSquare, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  content: string;
  isPublic: boolean;
  manualAccepting: boolean;
  acceptingUntil: string;
  creationTime: string;
  totalResponses: number;
  totalEarnings: string;
  identity: {
    name: string;
    profilePicture: string;
    isAnonymous: boolean;
  };
}

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
}

export function PostsList({ posts, isLoading }: PostsListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </li>
            ))
          : posts.map((post, index) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/mypost/${post.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {post.content}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isPublic
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          }`}
                        >
                          {post.isPublic ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          {post.totalResponses} responses
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          {post.totalEarnings} ETH earned
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <p>
                          Posted {new Date(post.creationTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {post.manualAccepting
                        ? "Manually accepting responses"
                        : `Accepting until ${new Date(
                            post.acceptingUntil
                          ).toLocaleString()}`}
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
      </ul>
    </div>
  );
}
