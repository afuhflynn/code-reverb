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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyActivity } from "@/lib/github-utils/actions";

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
  const { data, isPending, isError } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: getMonthlyActivity,
    refetchOnWindowFocus: false,
  });

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      month: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
      }),
    }));
  }, [data]);

  // ---------- Loading UI ----------
  if (isPending) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  // ---------- Error / Empty Fallback ----------
  if (isError || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No recent activity</CardTitle>
          <CardDescription>
            Monthly activity data could not be loaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Either there’s no activity for the last few months or the data source
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
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
