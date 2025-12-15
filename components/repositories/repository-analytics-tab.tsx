import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  GitPullRequest,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
} from "lucide-react";

interface RepositoryAnalyticsTabProps {
  repositoryId: string;
}

const mockAnalytics = {
  totalPRs: 156,
  mergedPRs: 142,
  openPRs: 8,
  avgReviewTime: "2.3 days",
  avgMergeTime: "4.1 days",
  reviewSuccessRate: 91,
  topReviewers: [
    { name: "john-doe", reviews: 45, avgTime: "1.8 days" },
    { name: "jane-smith", reviews: 38, avgTime: "2.1 days" },
    { name: "bob-wilson", reviews: 32, avgTime: "2.5 days" },
  ],
  monthlyStats: [
    { month: "Jan", prs: 12, reviews: 11 },
    { month: "Feb", prs: 18, reviews: 16 },
    { month: "Mar", prs: 22, reviews: 20 },
    { month: "Apr", prs: 15, reviews: 14 },
    { month: "May", prs: 28, reviews: 25 },
    { month: "Jun", prs: 31, reviews: 29 },
  ],
  aiInsights: [
    "Code quality has improved by 15% over the last 3 months",
    "Most common issues: missing error handling (23%), code style (18%)",
    "Average review time decreased by 0.5 days compared to last quarter",
  ],
};

export function RepositoryAnalyticsTab({
  repositoryId,
}: RepositoryAnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total PRs
                </p>
                <p className="text-2xl font-bold">{mockAnalytics.totalPRs}</p>
              </div>
              <GitPullRequest className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">
                  {mockAnalytics.reviewSuccessRate}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Review Time
                </p>
                <p className="text-2xl font-bold">
                  {mockAnalytics.avgReviewTime}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open PRs
                </p>
                <p className="text-2xl font-bold">{mockAnalytics.openPRs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.monthlyStats.map((stat) => (
                <div
                  key={stat.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{stat.month}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {stat.prs} PRs, {stat.reviews} reviews
                      </div>
                    </div>
                    <Progress
                      value={(stat.reviews / stat.prs) * 100}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Reviewers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Reviewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topReviewers.map((reviewer, index) => (
                <div
                  key={reviewer.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{reviewer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reviewer.reviews} reviews
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{reviewer.avgTime}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAnalytics.aiInsights.map((insight) => (
              <div
                key={insight}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
