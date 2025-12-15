import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch,
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  GitPullRequest,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const mockRepositories = [
  {
    id: 1,
    name: "web-app",
    fullName: "myorg/web-app",
    description:
      "Main web application frontend built with React and TypeScript",
    status: "connected",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    openPRs: 3,
    language: "TypeScript",
    stars: 45,
    isSelected: false,
  },
  {
    id: 2,
    name: "api-service",
    fullName: "myorg/api-service",
    description: "Backend API service with GraphQL and PostgreSQL",
    status: "connected",
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    openPRs: 5,
    language: "Go",
    stars: 23,
    isSelected: false,
  },
  {
    id: 3,
    name: "mobile-app",
    fullName: "myorg/mobile-app",
    description: "React Native mobile application",
    status: "pending",
    lastActivity: null,
    openPRs: 0,
    language: "TypeScript",
    stars: 12,
    isSelected: false,
  },
  {
    id: 4,
    name: "docs",
    fullName: "myorg/docs",
    description: "Project documentation and guides",
    status: "connected",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    openPRs: 1,
    language: "Markdown",
    stars: 8,
    isSelected: false,
  },
  {
    id: 5,
    name: "data-pipeline",
    fullName: "myorg/data-pipeline",
    description: "ETL data processing pipeline",
    status: "error",
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    openPRs: 2,
    language: "Python",
    stars: 15,
    isSelected: false,
  },
  {
    id: 6,
    name: "auth-service",
    fullName: "myorg/auth-service",
    description: "Authentication and authorization microservice",
    status: "connected",
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
    openPRs: 2,
    language: "Node.js",
    stars: 9,
    isSelected: false,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-orange-600" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <GitBranch className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-100 text-blue-800",
    Go: "bg-cyan-100 text-cyan-800",
    Python: "bg-yellow-100 text-yellow-800",
    "Node.js": "bg-green-100 text-green-800",
    Markdown: "bg-gray-100 text-gray-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
};

export function RepositoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockRepositories.map((repo) => (
        <Card key={repo.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Checkbox />
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10">
                    {repo.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Badge variant="outline" className={getStatusColor(repo.status)}>
                {getStatusIcon(repo.status)}
                <span className="ml-1">{repo.status}</span>
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {repo.fullName}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className={getLanguageColor(repo.language)}
                >
                  {repo.language}
                </Badge>
                <div className="flex items-center gap-1">
                  <GitPullRequest className="h-3 w-3" />
                  <span>{repo.openPRs} PRs</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {repo.lastActivity ? (
                  <span>
                    Updated{" "}
                    {formatDistanceToNow(repo.lastActivity, {
                      addSuffix: true,
                    })}
                  </span>
                ) : (
                  <span>No recent activity</span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
