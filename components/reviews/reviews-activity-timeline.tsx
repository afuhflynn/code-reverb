import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Bot,
  Star,
  MessageSquare,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useReviewsActivity } from "@/hooks";

const activityFeed = [
  {
    id: 1,
    type: "review_completed",
    title: "AI completed review of PR #123 in web-app",
    description: "Quality Score: 9.2/10 - Generated 12 insightful comments",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: CheckCircle,
    iconColor: "text-green-600",
    user: "AI Assistant",
  },
  {
    id: 2,
    type: "feedback_received",
    title: "User rated review 5/5 with feedback",
    description: '"Excellent suggestions, caught critical security issue"',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    icon: Star,
    iconColor: "text-yellow-600",
    user: "john-doe",
  },
  {
    id: 3,
    type: "review_started",
    title: "AI began reviewing PR #456 in api-service",
    description:
      "Using Security Expert persona - Complex authentication changes detected",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: Bot,
    iconColor: "text-purple-600",
    user: "AI Assistant",
  },
  {
    id: 4,
    type: "comment_posted",
    title: "AI posted 8 comments to GitHub PR #789",
    description:
      "Security vulnerabilities and performance optimizations identified",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    icon: MessageSquare,
    iconColor: "text-blue-600",
    user: "AI Assistant",
  },
  {
    id: 5,
    type: "review_failed",
    title: "Review failed for PR #999 in mobile-app",
    description: "API timeout - Will retry automatically",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: AlertCircle,
    iconColor: "text-red-600",
    user: "System",
  },
  {
    id: 6,
    type: "quality_improved",
    title: "AI quality score improved by 0.3 points",
    description: "Based on user feedback and learning algorithms",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: CheckCircle,
    iconColor: "text-green-600",
    user: "AI Learning",
  },
];

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case "review_completed":
      return "bg-green-100";
    case "feedback_received":
      return "bg-yellow-100";
    case "review_started":
      return "bg-blue-100";
    case "comment_posted":
      return "bg-purple-100";
    case "review_failed":
      return "bg-red-100";
    case "quality_improved":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

export function ReviewsActivityTimeline() {
  const { data: activities, isLoading } = useReviewsActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Review Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No recent activity found.
              </div>
            ) : (
              activities?.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-2 rounded-full ${getActivityTypeColor(activity.type)}`}
                    >
                      <CheckCircle
                        className={`h-4 w-4 ${activity.iconColor || "text-green-600"}`}
                      />
                    </div>
                    {index < (activities?.length || 0) - 1 && (
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
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
