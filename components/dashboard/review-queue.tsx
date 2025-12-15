import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  AlertTriangle,
  Users,
  Play,
  Calendar,
  Star,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const reviewQueue = [
  {
    id: 1,
    type: "high-priority",
    title: "Security vulnerability in authentication module",
    repository: "api-service",
    prNumber: 789,
    author: "security-team",
    priority: "critical",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    assignedTo: "You",
    estimatedTime: "30 min",
  },
  {
    id: 2,
    type: "assigned",
    title: "Database schema optimization",
    repository: "data-service",
    prNumber: 456,
    author: "db-admin",
    priority: "high",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    assignedTo: "You",
    estimatedTime: "45 min",
  },
  {
    id: 3,
    type: "team-review",
    title: "New payment processing feature",
    repository: "payment-service",
    prNumber: 123,
    author: "payment-team",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    assignedTo: "Payment Team",
    estimatedTime: "1 hour",
  },
  {
    id: 4,
    type: "auto-scheduled",
    title: "UI component library updates",
    repository: "web-app",
    prNumber: 999,
    author: "frontend-team",
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignedTo: "AI Scheduled",
    estimatedTime: "20 min",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "high-priority":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "assigned":
      return <Star className="h-4 w-4 text-yellow-600" />;
    case "team-review":
      return <Users className="h-4 w-4 text-blue-600" />;
    case "auto-scheduled":
      return <Clock className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "high-priority":
      return "bg-red-100 text-red-800 border-red-200";
    case "assigned":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "team-review":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "auto-scheduled":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ReviewQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviewQueue.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full bg-muted ${getTypeColor(item.type)}`}
              >
                {getTypeIcon(item.type)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium leading-tight">
                        {item.repository}#{item.prNumber}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(item.priority)}
                      >
                        {item.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getTypeColor(item.type)}
                      >
                        {item.type.replace("-", " ")}
                      </Badge>
                    </div>
                    <h5 className="text-sm leading-tight">{item.title}</h5>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>by {item.author}</span>
                      <span>Assigned: {item.assignedTo}</span>
                      <span>Est: {item.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Due{" "}
                        {formatDistanceToNow(item.dueDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    Start Review
                  </Button>
                  <Button size="sm" variant="outline">
                    View PR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {reviewQueue.length} reviews pending your attention
            </span>
            <Button variant="ghost" size="sm">
              View All Reviews
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
