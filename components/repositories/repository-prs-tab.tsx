import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch,
  Search,
  Filter,
  Eye,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const mockPRs = [
  {
    id: 1,
    number: 123,
    title: "Add user authentication system",
    author: "john-doe",
    status: "open",
    reviewStatus: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    comments: 5,
    commits: 3,
  },
  {
    id: 2,
    number: 456,
    title: "Implement dark mode toggle",
    author: "jane-smith",
    status: "open",
    reviewStatus: "in-progress",
    priority: "medium",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    comments: 8,
    commits: 2,
  },
  {
    id: 3,
    number: 789,
    title: "Fix memory leak in data processing",
    author: "bob-wilson",
    status: "merged",
    reviewStatus: "completed",
    priority: "high",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    comments: 12,
    commits: 5,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <GitBranch className="h-4 w-4 text-green-600" />;
    case "merged":
      return <CheckCircle className="h-4 w-4 text-purple-600" />;
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

interface RepositoryPRsTabProps {
  repositoryId: string;
}

export function RepositoryPRsTab({ repositoryId }: RepositoryPRsTabProps) {
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search pull requests..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Review Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRs List */}
      <div className="space-y-4">
        {mockPRs.map((pr) => (
          <Card key={pr.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {pr.author
                        .split("-")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{pr.number}</span>
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

                    <h3 className="text-lg font-semibold leading-tight">
                      {pr.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>by {pr.author}</span>
                      <span>{pr.comments} comments</span>
                      <span>{pr.commits} commits</span>
                      <span>
                        Updated{" "}
                        {formatDistanceToNow(pr.updatedAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {pr.reviewStatus === "pending" && (
                    <Button size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Start Review
                    </Button>
                  )}
                  {pr.reviewStatus === "in-progress" && (
                    <Button size="sm" variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Continue Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {mockPRs.length} pull requests
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Bulk Assign
              </Button>
              <Button variant="outline" size="sm">
                Export List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
