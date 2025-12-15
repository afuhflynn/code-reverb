import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  GitMerge,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const mockPRs = [
  {
    id: 1,
    number: 123,
    title: "Add user authentication system",
    repository: "web-app",
    author: "john-doe",
    status: "open",
    reviewStatus: "pending",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "high",
  },
  {
    id: 2,
    number: 456,
    title: "Implement dark mode toggle",
    repository: "mobile-app",
    author: "jane-smith",
    status: "open",
    reviewStatus: "in-progress",
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    priority: "medium",
  },
  {
    id: 3,
    number: 789,
    title: "Fix memory leak in data processing",
    repository: "api-service",
    author: "bob-wilson",
    status: "merged",
    reviewStatus: "completed",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    priority: "high",
  },
  {
    id: 4,
    number: 101,
    title: "Update documentation for API endpoints",
    repository: "docs",
    author: "alice-brown",
    status: "open",
    reviewStatus: "pending",
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: "low",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <GitBranch className="h-4 w-4 text-green-600" />;
    case "merged":
      return <GitMerge className="h-4 w-4 text-purple-600" />;
    case "closed":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <GitBranch className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800";
    case "merged":
      return "bg-purple-100 text-purple-800";
    case "closed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getReviewStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "low":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentPRsFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Latest Pull Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockPRs.map((pr) => (
          <div
            key={pr.id}
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {pr.author
                  .split("-")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {pr.repository}#{pr.number}
                    </span>
                    {getStatusIcon(pr.status)}
                    <Badge
                      variant="outline"
                      className={getStatusColor(pr.status)}
                    >
                      {pr.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getReviewStatusColor(pr.reviewStatus)}
                    >
                      {pr.reviewStatus}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(pr.priority)}
                    >
                      {pr.priority}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-medium leading-tight">
                    {pr.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>by {pr.author}</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(pr.lastActivity, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                {pr.reviewStatus === "pending" && (
                  <Button size="sm">Start Review</Button>
                )}
                {pr.reviewStatus === "in-progress" && (
                  <Button size="sm" variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Continue Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Pull Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
