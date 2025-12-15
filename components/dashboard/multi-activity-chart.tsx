"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMultiAtivityChart } from "@/hooks";

const chartConfig = {
  commits: {
    label: "Commits",
    color: "hsl(var(--chart-1))",
  },
  pullRequests: {
    label: "Pull Requests",
    color: "hsl(var(--chart-2))",
  },
  aiReviews: {
    label: "AI Reviews",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function MultiActivityChart() {
  const { data, isPending, isError } = useMultiAtivityChart();

  /**
   * Backend already sends:
   * { date: "Nov", commits: number, pullRequests: number, aiReviews: number }
   * So we DO NOT parse it as a Date. We just display it.
   */
  const chartData = useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      month:
        item.date.slice(0, 1).toUpperCase() + item.date.slice(1).toLowerCase(),
      commits: item.commits ?? 0,
      pullRequests: item.pullRequests ?? 0,
      aiReviews: item.aiReviews ?? 0,
    }));
  }, [data]);

  // ---------- Loading UI ----------
  if (isPending) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  // ---------- Error / Empty State ----------
  if (isError || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No recent activity</CardTitle>
          <CardDescription>
            Monthly activity data is unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Either there was no activity during this period or the data source
          declined to cooperate.
        </CardContent>
      </Card>
    );
  }

  // ---------- Real Chart ----------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity (Last 3 Months)</CardTitle>
        <CardDescription>
          Commits, pull requests, and AI reviews per month.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={16} barGap={4}>
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey="commits"
                fill="var(--color-commits)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pullRequests"
                fill="var(--color-pullRequests)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="aiReviews"
                fill="var(--color-aiReviews)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
