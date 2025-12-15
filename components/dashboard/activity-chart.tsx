"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDailyActivityChart } from "@/hooks";

const getActivityLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const activityColors: Record<number, string> = {
  0: "bg-gray-700/30 dark:bg-gray-800/30 cursor-pointer",
  1: "bg-emerald-200 dark:bg-emerald-900 cursor-pointer",
  2: "bg-emerald-300 dark:bg-emerald-800 cursor-pointer",
  3: "bg-emerald-400 dark:bg-emerald-700 cursor-pointer",
  4: "bg-emerald-500 dark:bg-emerald-600 cursor-pointer",
};

export function ActivityChart() {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: dailyActivities, isPending, isError } = useDailyActivityChart();

  const generateYearGrid = useCallback((year: number) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const grid: DailyActivity[][] = Array.from({ length: 7 }, () => []);

    const firstDayOfWeek = (startDate.getDay() + 6) % 7;
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid[i].push({ date: `empty-${i}`, count: -1 });
    }

    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const date = currentDate.toISOString().split("T")[0];
      const dayIdx = (currentDate.getDay() + 6) % 7;
      grid[dayIdx].push({ date, count: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return grid;
  }, []);

  useEffect(() => {
    if (!dailyActivities || dailyActivities.length === 0) {
      setActivities([]);
      setTotalContributions(0);
      return;
    }

    const filtered = dailyActivities.filter(
      (a) => new Date(a.date).getFullYear() === selectedYear
    );

    const map = new Map(filtered.map((a) => [a.date, a.count]));
    const grid = generateYearGrid(selectedYear);

    const populated = grid
      .flat()
      .map((day) =>
        day.count === -1 ? day : { ...day, count: map.get(day.date) ?? 0 }
      );

    setActivities(populated.filter((d) => d.count !== -1));
    setTotalContributions(filtered.reduce((sum, a) => sum + a.count, 0));
  }, [dailyActivities, selectedYear, generateYearGrid]);

  const availableYears = useMemo(() => {
    if (!dailyActivities) return [new Date().getFullYear()];
    const years = Array.from(
      new Set(dailyActivities.map((a) => new Date(a.date).getFullYear()))
    ).sort((a, b) => b - a);
    return years.length ? years : [new Date().getFullYear()];
  }, [dailyActivities]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const date = new Date(selectedYear, m, 1);
      const weekIdx = Math.floor(
        (date.getTime() - new Date(selectedYear, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      );
      labels.push({
        month: date.toLocaleString("default", { month: "short" }),
        index: weekIdx,
      });
    }
    return labels;
  }, [selectedYear]);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (isPending) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="grid grid-flow-col auto-cols-min gap-1.5 overflow-hidden">
            {Array.from({ length: 53 * 7 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-sm" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !dailyActivities || dailyActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No contribution data</CardTitle>
          <CardDescription>
            We could not load GitHub activity for this account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Either the account has no public activity or the GitHub API decided to
          be uncooperative.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle>
              {totalContributions} Contributions in {selectedYear}
            </CardTitle>
            <CardDescription>GitHub contribution activity</CardDescription>
          </div>

          <Select
            value={selectedYear.toString()}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <TooltipProvider delayDuration={0}>
          <div className="flex">
            <div className="grid grid-rows-7 gap-1.5 mr-2">
              {dayLabels.map((label, i) => (
                <div key={i} className="text-xs text-muted-foreground">
                  {["Mon", "Wed", "Fri"].includes(label) ? label : ""}
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-1.5 mb-2 ml-6">
                {monthLabels.map(({ month, index }) => (
                  <div
                    key={month}
                    style={{ gridColumnStart: index + 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    {month}
                  </div>
                ))}
              </div>

              <div className="grid grid-flow-col auto-cols-min gap-1.5 min-w-max">
                {Array.from({ length: 53 }).map((_, weekIdx) => (
                  <div key={weekIdx} className="grid grid-rows-7 gap-1.5">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const day = activities[weekIdx * 7 + dayIdx];
                      if (!day) return <div key={dayIdx} />;

                      const level = getActivityLevel(day.count);
                      const formattedDate = new Date(
                        day.date
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <div
                              aria-label={`${day.count} contributions on ${formattedDate}`}
                              role="button"
                              className={`h-3 w-3 rounded-sm ${activityColors[level]}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-card text-foreground">
                            {day.count || "No"} contribution
                            {day.count === 1 ? "" : "s"} on {formattedDate}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
            <span>Less</span>
            {Object.keys(activityColors).map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-sm ${
                  activityColors[Number(level)]
                }`}
              />
            ))}
            <span>More</span>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
