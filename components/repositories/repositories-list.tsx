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
  Star,
  GitFork,
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
    forks: 12,
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
    forks: 8,
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
    forks: 3,
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
    forks: 15,
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
    forks: 6,
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
    forks: 4,
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

interface RepositoriesListProps {
  selectedRepos: number[];
  onRepoSelect: (repoId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  searchQuery: string;
  statusFilter: string;
  languageFilter: string;
  sortBy: string;
}

export function RepositoriesList({
  selectedRepos,
  onRepoSelect,
  onSelectAll,
  searchQuery,
  statusFilter,
  languageFilter,
  sortBy,
}: RepositoriesListProps) {
  const filteredRepos = mockRepositories
    .filter((repo) => {
      if (
        searchQuery &&
        !repo.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !repo.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== "all" && repo.status !== statusFilter) {
        return false;
      }
      if (
        languageFilter !== "all" &&
        repo.language.toLowerCase() !== languageFilter
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "activity":
          return (
            (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0)
          );
        case "prs":
          return b.openPRs - a.openPRs;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-2">
      {filteredRepos.map((repo) => (
        <Card key={repo.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Checkbox
                  checked={selectedRepos.includes(repo.id)}
                  onCheckedChange={(checked) =>
                    onRepoSelect(repo.id, checked as boolean)
                  }
                />
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10">
                    {repo.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {repo.fullName}
                    </h3>
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
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      <span>{repo.forks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitPullRequest className="h-3 w-3" />
                      <span>{repo.openPRs} PRs</span>
                    </div>
                    <span>
                      {repo.lastActivity
                        ? `Updated ${formatDistanceToNow(repo.lastActivity, {
                            addSuffix: true,
                          })}`
                        : "No recent activity"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
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
