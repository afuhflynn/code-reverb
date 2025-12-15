import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch,
  Star,
  GitFork,
  GitPullRequest,
  ExternalLink,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  status: string;
  language: string;
  stars: number;
  forks: number;
  openPRs: number;
  lastActivity: Date;
}

interface RepositoryHeaderProps {
  repository: Repository;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "pending":
      return <Clock className="h-5 w-5 text-orange-600" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    default:
      return <GitBranch className="h-5 w-5" />;
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
    JavaScript: "bg-yellow-100 text-yellow-800",
    "Node.js": "bg-green-100 text-green-800",
    Markdown: "bg-gray-100 text-gray-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
};

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Repository Info */}
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-lg">
                {repository.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{repository.fullName}</h1>
                  {getStatusIcon(repository.status)}
                  <Badge
                    variant="outline"
                    className={getStatusColor(repository.status)}
                  >
                    {repository.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getLanguageColor(repository.language)}
                  >
                    {repository.language}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                  {repository.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{repository.stars} stars</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{repository.forks} forks</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitPullRequest className="h-4 w-4" />
                  <span>{repository.openPRs} open PRs</span>
                </div>
                <div>
                  Updated{" "}
                  {formatDistanceToNow(repository.lastActivity, {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              New Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
