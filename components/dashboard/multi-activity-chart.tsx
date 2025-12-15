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
  Legend,
} from "recharts";
import { useMultiAtivityChart } from "@/hooks";

const chartConfig = {
  commits: {
    label: "Commits",
    color: "hsl(217, 91%, 60%)", // Blue color matching the image
  },
  pullRequests: {
    label: "Pull Requests",
    color: "hsl(271, 91%, 65%)", // Purple color matching the image
  },
  aiReviews: {
    label: "AI Reviews",
    color: "hsl(158, 64%, 52%)", // Green/teal color matching the image
  },
} satisfies ChartConfig;

// Custom legend component to match the image
const CustomLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: chartConfig.commits.color }}
        />
        <span className="text-muted-foreground">Commits</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: chartConfig.pullRequests.color }}
        />
        <span className="text-muted-foreground">Pull Requests</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: chartConfig.aiReviews.color }}
        />
        <span className="text-muted-foreground">AI Reviews</span>
      </div>
    </div>
  );
};

// Custom tooltip to show detailed breakdown
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 space-y-1">
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function MultiActivityChart() {
  const { data, isPending, isError } = useMultiAtivityChart();

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      month:
        item.date.charAt(0).toUpperCase() + item.date.slice(1).toLowerCase(),
      commits: item.commits ?? 0,
      pullRequests: item.pullRequests ?? 0,
      aiReviews: item.aiReviews ?? 0,
    }));
  }, [data]);

  // Calculate totals for summary stats
  const totals = useMemo(() => {
    if (chartData.length === 0)
      return { commits: 0, pullRequests: 0, aiReviews: 0 };
    return chartData.reduce(
      (acc, curr) => ({
        commits: acc.commits + curr.commits,
        pullRequests: acc.pullRequests + curr.pullRequests,
        aiReviews: acc.aiReviews + curr.aiReviews,
      }),
      { commits: 0, pullRequests: 0, aiReviews: 0 }
    );
  }, [chartData]);

  // ---------- Loading UI ----------
  if (isPending) {
    return (
      <Card className="bg-card">
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
      <Card className="bg-card">
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
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Activity Overview</CardTitle>
        <CardDescription>
          Monthly breakdown of commits, PRs, and reviews (last{" "}
          {chartData.length} months)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Commits</p>
            <p
              className="text-2xl font-bold"
              style={{ color: chartConfig.commits.color }}
            >
              {totals.commits}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Pull Requests</p>
            <p
              className="text-2xl font-bold"
              style={{ color: chartConfig.pullRequests.color }}
            >
              {totals.pullRequests}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total AI Reviews</p>
            <p
              className="text-2xl font-bold"
              style={{ color: chartConfig.aiReviews.color }}
            >
              {totals.aiReviews}
            </p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap="20%"
              barGap={2}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
              />
              <Bar
                dataKey="commits"
                fill={chartConfig.commits.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="pullRequests"
                fill={chartConfig.pullRequests.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="aiReviews"
                fill={chartConfig.aiReviews.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Custom Legend */}
        <CustomLegend />
      </CardContent>
    </Card>
  );
}
