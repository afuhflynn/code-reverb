import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Target,
  Clock,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useReviewsStats } from "@/hooks";

export function ReviewsHeader() {
  const { data: stats, isLoading } = useReviewsStats();

  const statsData = stats
    ? [
        {
          title: "Total Reviews",
          subtitle: "Across All Repositories",
          value: stats.totalReviews?.toLocaleString() || "0",
          change: stats.totalChange || "+0%",
          changeType: stats.totalChange?.startsWith("+")
            ? "positive"
            : "negative",
          icon: FileText,
          color: "text-blue-600",
        },
        {
          title: "Success Rate",
          subtitle: "Across All Repositories",
          value: `${stats.successRate || 0}%`,
          change: "+2.1%", // This would come from historical data
          changeType: "positive" as const,
          icon: Target,
          color: "text-green-600",
        },
        {
          title: "Avg Review Time",
          subtitle: "Across All Repositories",
          value: `${stats.avgTime || 0}s`,
          change: "-0.3s", // This would come from historical data
          changeType: "positive" as const,
          icon: Clock,
          color: "text-orange-600",
        },
        {
          title: "Weekly Growth",
          subtitle: "Across All Repositories",
          value: `${stats.weeklyGrowth || 0}%`,
          change: "+5%", // This would come from historical data
          changeType: "positive" as const,
          icon: BarChart3,
          color: "text-purple-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Reviews Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive review management across all your repositories
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            New Review
          </Button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((x, i) => (
              <Card key={`${i}-${x}`} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
                    </div>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statsData.map((stat) => (
              <Card key={stat.title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      {stat.change && (
                        <div className="flex items-center space-x-1 text-xs">
                          {stat.changeType === "positive" ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span
                            className={
                              stat.changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-75`} />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
