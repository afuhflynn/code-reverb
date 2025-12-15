"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  ExternalLink,
  Star,
  GitFork,
  Lock,
  AlertCircle,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRepositories } from "@/hooks";
import { useQueryStates } from "nuqs";
import { searchParamsSchema } from "@/nuqs";
import { getLanguageColor, getStatusColor } from "@/utils";
import { RepositoryCardSkeleton } from "../skeletons/repo-loading";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Empty state component
function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No repositories found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </CardContent>
    </Card>
  );
}

// Error state component
function ErrorState() {
  return (
    <Card className="border-destructive">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-semibold text-lg mb-2">
          Failed to load repositories
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There was an error loading your repositories. Please try again later.
        </p>
      </CardContent>
    </Card>
  );
}

export function RepositoriesList() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useRepositories();
  const [params] = useQueryStates(searchParamsSchema);
  const allRepos = data?.pages.flatMap((page) => page) || [];

  const filteredRepos = allRepos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(params.repoSearch.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(params.repoSearch.toLowerCase());

    const matchesStatus =
      params.status === "all" ||
      (params.status === "public" && !repo.private) ||
      (params.status === "private" && repo.private);

    return matchesSearch && matchesStatus;
  });

  // Loading state - show skeleton cards
  if (isPending) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <RepositoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return <ErrorState />;
  }

  // Empty state
  if (filteredRepos.length === 0) {
    return <EmptyState />;
  }

  // Success state with data
  return (
    <div className="space-y-3">
      {filteredRepos.map((repo) => (
        <Card
          key={repo.id}
          className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200"
        >
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12 border-2 border-muted">
                  <AvatarImage src={repo.owner.avatar_url} alt={repo.name} />
                  <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                    {repo.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                      {repo.name}
                    </h3>

                    {repo.language && (
                      <Badge
                        variant="outline"
                        className={`${getLanguageColor(repo.language)} text-xs`}
                      >
                        {repo.language}
                      </Badge>
                    )}
                    {repo.private && (
                      <Badge
                        variant="outline"
                        className="text-xs gap-1 flex items-center"
                      >
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>

                  {repo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Star className="h-3.5 w-3.5" />
                      <span className="font-medium">
                        {repo.stargazers_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <GitFork className="h-3.5 w-3.5" />
                      <span className="font-medium">
                        {repo.forks.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs">
                      {repo.updated_at
                        ? `Updated ${formatDistanceToNow(repo.updated_at, {
                            addSuffix: true,
                          })}`
                        : "No recent activity"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 flex-wrap">
                <Button className="min-w-30 hover:bg-primary/90 transition-colors flex-1 md:flex-none">
                  <Plus className="h-4 w-4 mr-1" />
                  Connect Repository
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-secondary transition-colors"
                  asChild
                >
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Visit
                  </Link>
                </Button>
              </div>
            </div>

            {/* Status Badge */}
            {repo.isConnected && (
              <Badge
                className={cn(
                  getStatusColor(repo.isConnected ? "connected" : "pending"), // expects "connected", "pending", etc.
                  "absolute top-3 right-3 text-xs flex items-center gap-1 px-2 py-1"
                )}
              >
                {repo.isConnected ? "Connected" : "Pending"}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading more...
              </>
            ) : (
              "Load more repositories"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
