import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  CheckCircle,
  GitBranch,
  Bot,
  Settings,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityFeed = [
  {
    id: 1,
    type: "review_completed",
    title: "Completed review of PR #456 in 'web-app'",
    description:
      "AI generated 12 insightful comments on the React component refactoring",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: CheckCircle,
    iconColor: "text-green-600",
    user: "AI Assistant",
  },
  {
    id: 2,
    type: "repo_connected",
    title: "Connected repository 'mobile-app'",
    description:
      "Successfully integrated with GitHub webhook for real-time PR monitoring",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: GitBranch,
    iconColor: "text-blue-600",
    user: "You",
  },
  {
    id: 3,
    type: "ai_generated",
    title: "AI generated 8 comments on PR #789",
    description:
      "Identified potential security vulnerability in authentication flow",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: Bot,
    iconColor: "text-purple-600",
    user: "AI Assistant",
  },
  {
    id: 4,
    type: "persona_updated",
    title: "Updated persona 'Code Quality Expert'",
    description:
      "Enhanced prompts for better TypeScript and React best practices detection",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: Settings,
    iconColor: "text-orange-600",
    user: "You",
  },
  {
    id: 5,
    type: "review_started",
    title: "Started review of PR #123 in 'api-service'",
    description: "High-complexity changes in the payment processing module",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: FileText,
    iconColor: "text-indigo-600",
    user: "You",
  },
];

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case "review_completed":
      return "bg-green-100";
    case "repo_connected":
      return "bg-blue-100";
    case "ai_generated":
      return "bg-purple-100";
    case "persona_updated":
      return "bg-orange-100";
    case "review_started":
      return "bg-indigo-100";
    default:
      return "bg-gray-100";
  }
};

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityFeed.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`p-2 rounded-full ${getActivityTypeColor(activity.type)}`}
                >
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                {index < activityFeed.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>

              {/* Activity content */}
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Activity from the last 24 hours
            </span>
            <div className="flex gap-2">
              <select className="text-xs border rounded px-2 py-1 bg-background">
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
