"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

interface MultiActivityChartProps {
  data: MultiActivityData[];
}

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

export function MultiActivityChart({ data }: MultiActivityChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity (Last 3 Months)</CardTitle>
        <CardDescription>
          Your commits, pull requests, and AI reviews over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="var(--color-commits)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pullRequests"
              stroke="var(--color-pullRequests)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="aiReviews"
              stroke="var(--color-aiReviews)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
