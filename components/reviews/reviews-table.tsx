import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Eye,
  ExternalLink,
  RotateCcw,
  Star,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useReviews, useRetryReview } from "@/hooks";

const mockReviews = [
  {
    id: "rev_001",
    repository: "web-app",
    prNumber: 123,
    title: "Add authentication system",
    status: "completed",
    qualityScore: 9.2,
    persona: "Code Quality",
    duration: "2.3 min",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    author: "john-doe",
    isSelected: false,
  },
  {
    id: "rev_002",
    repository: "api-service",
    prNumber: 456,
    title: "Database optimization",
    status: "in-progress",
    qualityScore: null,
    persona: "Security Expert",
    duration: "45 sec",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    author: "jane-smith",
    isSelected: false,
  },
  {
    id: "rev_003",
    repository: "mobile-app",
    prNumber: 789,
    title: "UI improvements",
    status: "failed",
    qualityScore: null,
    persona: "Balanced",
    duration: "-",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    author: "bob-wilson",
    isSelected: false,
  },
  {
    id: "rev_004",
    repository: "docs",
    prNumber: 101,
    title: "Update API documentation",
    status: "completed",
    qualityScore: 8.7,
    persona: "Code Quality",
    duration: "1.8 min",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    author: "alice-brown",
    isSelected: false,
  },
  {
    id: "rev_005",
    repository: "data-pipeline",
    prNumber: 202,
    title: "Add error handling",
    status: "completed",
    qualityScore: 9.5,
    persona: "Performance",
    duration: "3.1 min",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    author: "charlie-davis",
    isSelected: false,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getQualityColor = (score: number | null) => {
  if (!score) return "bg-gray-100 text-gray-800";
  if (score >= 9) return "bg-green-100 text-green-800";
  if (score >= 7) return "bg-blue-100 text-blue-800";
  if (score >= 5) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export function ReviewsTable({
  filters,
  onPageChange,
}: {
  filters?: any;
  onPageChange?: (page: number) => void;
}) {
  const { data: reviewsData, isLoading } = useReviews(filters);
  const retryReview = useRetryReview();

  const { reviews = [], pagination } = reviewsData || {};
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Reviews Across All Repositories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Checkbox />
                </th>
                <th className="text-left p-2 font-medium">Repository</th>
                <th className="text-left p-2 font-medium">PR #</th>
                <th className="text-left p-2 font-medium">Title</th>
                <th className="text-left p-2 font-medium">Status</th>
                <th className="text-left p-2 font-medium">Quality</th>
                <th className="text-left p-2 font-medium">Persona</th>
                <th className="text-left p-2 font-medium">Duration</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((x, i) => (
                  <tr key={`${i}-${x}`} className="border-b">
                    <td className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-12" />
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-32" />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="h-6 bg-muted rounded animate-pulse w-16" />
                    </td>
                    <td className="p-2">
                      <div className="h-6 bg-muted rounded animate-pulse w-12" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-16" />
                    </td>
                    <td className="p-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-12" />
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <div className="h-7 w-7 bg-muted rounded animate-pulse" />
                        <div className="h-7 w-7 bg-muted rounded animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No reviews found matching your criteria.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <Checkbox />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {review.repository.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.repository}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="font-mono text-sm">
                        #{review.prNumber}
                      </span>
                    </td>
                    <td className="p-2 max-w-xs">
                      <div className="truncate" title={review.title}>
                        {review.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {review.author} •{" "}
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(review.status)}
                      >
                        {getStatusIcon(review.status)}
                        <span className="ml-1 capitalize">
                          {review.status.replace("-", " ")}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      {review.qualityScore ? (
                        <Badge
                          variant="outline"
                          className={getQualityColor(review.qualityScore)}
                        >
                          {review.qualityScore}/10
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{review.persona}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{review.duration}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        {review.status === "failed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => retryReview.mutate(review.id)}
                            disabled={retryReview.isPending}
                          >
                            {retryReview.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        {review.status === "in-progress" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        {review.status === "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              5 reviews selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Retry Failed
            </Button>
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              Reassign Personas
            </Button>
            <Button variant="outline" size="sm">
              Bulk Rate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
