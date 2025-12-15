"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
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
import { RepositoryGridCardSkeleton } from "../skeletons/repo-loading";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Empty state component
function EmptyState() {
  return (
    <div className="col-span-full">
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
    </div>
  );
}

// Error state component
function ErrorState() {
  return (
    <div className="col-span-full">
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Failed to load repositories
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            There was an error loading your repositories. Please try again
            later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function RepositoriesGrid() {
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

  // Filter by search and status
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Loading state */}
        {isPending &&
          [...Array(6)].map((_, i) => <RepositoryGridCardSkeleton key={i} />)}

        {/* Error state */}
        {isError && <ErrorState />}

        {/* Empty state */}
        {!isPending && !isError && filteredRepos.length === 0 && <EmptyState />}

        {/* Success state with data */}
        {!isPending &&
          !isError &&
          filteredRepos.map((repo) => (
            <Card
              key={repo.id}
              className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200 relative"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12 border-2 border-muted">
                    <AvatarImage src={repo.owner.avatar_url} alt={repo.name} />
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                      {repo.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors mb-1">
                      {repo.full_name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
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

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {repo.updated_at
                      ? `Updated ${formatDistanceToNow(repo.updated_at, {
                          addSuffix: true,
                        })}`
                      : "No recent activity"}
                  </div>

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button className="flex-1 hover:bg-primary/90 transition-colors">
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
                      getStatusColor(
                        repo.isConnected ? "connected" : "pending"
                      ), // expects "connected", "pending", etc.
                      "absolute top-3 right-3 text-xs flex items-center gap-1 px-2 py-1"
                    )}
                  >
                    {repo.isConnected ? "Connected" : "Pending"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Load More Button */}
      {!isPending && !isError && hasNextPage && (
        <div className="flex justify-center pt-6">
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
    </>
  );
}
