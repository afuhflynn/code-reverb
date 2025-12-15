"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch,
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const mockRepositories = [
  {
    id: 1,
    name: "web-app",
    fullName: "myorg/web-app",
    description: "Main web application frontend",
    status: "connected",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    openPRs: 3,
    language: "TypeScript",
  },
  {
    id: 2,
    name: "api-service",
    fullName: "myorg/api-service",
    description: "Backend API service",
    status: "connected",
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    openPRs: 5,
    language: "Go",
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
  },
  {
    id: 4,
    name: "docs",
    fullName: "myorg/docs",
    description: "Project documentation",
    status: "connected",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    openPRs: 1,
    language: "Markdown",
  },
  {
    id: 5,
    name: "data-pipeline",
    fullName: "myorg/data-pipeline",
    description: "ETL data processing pipeline",
    status: "error",
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    openPRs: 2,
    language: "Python",
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
    Markdown: "bg-gray-100 text-gray-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
};

export function ActiveRepositories() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Your Repositories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRepositories.map((repo) => (
          <div
            key={repo.id}
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10">
                {repo.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{repo.fullName}</h4>
                    {getStatusIcon(repo.status)}
                    <Badge
                      variant="outline"
                      className={getStatusColor(repo.status)}
                    >
                      {repo.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getLanguageColor(repo.language)}
                    >
                      {repo.language}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.lastActivity && (
                      <span>
                        {formatDistanceToNow(repo.lastActivity, {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                    <span>{repo.openPRs} open PRs</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/repositories/${repo.id}`)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/repositories/${repo.id}`)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
                {repo.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/repositories/${repo.id}`)}
                  >
                    Complete Setup
                  </Button>
                )}
                {repo.status === "error" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => router.push(`/repositories/${repo.id}`)}
                  >
                    Fix Connection
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/repositories")}
          >
            Connect New Repository
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
