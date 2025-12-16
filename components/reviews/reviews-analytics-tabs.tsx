"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Brain, Target, Loader2 } from "lucide-react";
import { useReviewsAnalytics } from "@/hooks";

export function ReviewsAnalyticsTabs() {
  const { data: analytics, isLoading } = useReviewsAnalytics("performance");

  return (
    <Tabs defaultValue="performance" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          ML Insights
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="predictive" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Predictive
        </TabsTrigger>
      </TabsList>

      <TabsContent value="performance" className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Rate by Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.successRateByRepo?.map((repo) => (
                    <div
                      key={repo.repository}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{repo.repository}</span>
                      <span className="text-sm font-medium">
                        {repo.successRate}%
                      </span>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Review Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.avgTimeByPersona?.map((persona) => (
                    <div
                      key={persona.persona}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{persona.persona}</span>
                      <span className="text-sm font-medium">
                        {persona.avgTime}s
                      </span>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.qualityDistribution?.map((range) => (
                    <div
                      key={range.range}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{range.range}</span>
                      <span className="text-sm font-medium">
                        {range.percentage}%
                      </span>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>

      <TabsContent value="insights" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Accuracy Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      94.2%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      True Positives
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">3.1%</div>
                    <div className="text-sm text-muted-foreground">
                      False Positives
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      89.7%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      True Negatives
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">2.8%</div>
                    <div className="text-sm text-muted-foreground">
                      False Negatives
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persona Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Code Quality Expert</span>
                  <span className="text-sm font-medium text-green-600">
                    96.8%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Expert</span>
                  <span className="text-sm font-medium text-green-600">
                    94.3%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Performance Analyst</span>
                  <span className="text-sm font-medium text-blue-600">
                    91.7%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Balanced Reviewer</span>
                  <span className="text-sm font-medium text-blue-600">
                    89.2%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Week</span>
                  <span className="text-sm font-medium">+23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Week</span>
                  <span className="text-sm font-medium">+18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2 Weeks Ago</span>
                  <span className="text-sm font-medium">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">3 Weeks Ago</span>
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Score</span>
                  <span className="text-sm font-medium">+0.3 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High-Quality Reviews</span>
                  <span className="text-sm font-medium">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Reviews</span>
                  <span className="text-sm font-medium">-8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Satisfaction</span>
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Quality Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Issues</span>
                  <span className="text-sm font-medium text-green-600">
                    -25%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Performance Issues</span>
                  <span className="text-sm font-medium text-green-600">
                    -18%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Code Quality</span>
                  <span className="text-sm font-medium text-green-600">
                    +22%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Best Practices</span>
                  <span className="text-sm font-medium text-green-600">
                    +15%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="predictive" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Next Review Prediction
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    9.1/10
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Based on current patterns
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>High Confidence</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-red-900">
                        High Risk PR
                      </div>
                      <div className="text-xs text-red-700">
                        Complex auth changes
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-600">85%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-yellow-900">
                        Medium Risk PR
                      </div>
                      <div className="text-xs text-yellow-700">
                        Database schema changes
                      </div>
                    </div>
                    <div className="text-lg font-bold text-yellow-600">62%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-green-900">
                        Low Risk PR
                      </div>
                      <div className="text-xs text-green-700">
                        Documentation updates
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">23%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
