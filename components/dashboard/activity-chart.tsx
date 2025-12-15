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
import { months } from "@/constants";

interface UserActivityGraphProps {
  dailyActivities: DailyActivity[];
}

// Helper to get activity level for coloring
const getActivityLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4; // More than 9 contributions
};

// Colors for the activity squares
const activityColors: { [key: number]: string } = {
  0: "bg-gray-700/30 dark:bg-gray-800/30", // No contributions
  1: "bg-emerald-200 dark:bg-emerald-900",
  2: "bg-emerald-300 dark:bg-emerald-800",
  3: "bg-emerald-400 dark:bg-emerald-700",
  4: "bg-emerald-500 dark:bg-emerald-600", // Max contributions
};

export function ActivityChart({ dailyActivities }: UserActivityGraphProps) {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Function to generate the empty grid for a given year
  const generateYearGrid = useCallback((year: number) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const grid: DailyActivity[][] = Array.from({ length: 7 }, () => []); // 7 days of the week

    let currentDate = new Date(startDate);

    // Fill leading empty days if Jan 1st is not a Monday (0 for Mon, 6 for Sun)
    const firstDayOfWeek = (startDate.getDay() + 6) % 7; // Adjust to 0=Mon, 6=Sun
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid[i].push({ date: `empty-${i}`, count: -1 }); // -1 indicates an empty slot
    }

    while (currentDate < endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const dayOfWeek = (currentDate.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      grid[dayOfWeek].push({ date: dateString, count: 0 }); // Initially 0, will be filled
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return grid;
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const filteredActivities = dailyActivities.filter(
      (activity) => new Date(activity.date).getFullYear() === selectedYear
    );

    const activitiesMap = new Map<string, number>();
    for (const c of filteredActivities) {
      activitiesMap.set(c.date, c.count);
    }

    const yearGrid = generateYearGrid(selectedYear);
    const populatedActivities: DailyActivity[][] = yearGrid.map((week) =>
      week.map((day) => {
        if (day.count === -1) return day;
        const count = activitiesMap.get(day.date) || 0;
        return { ...day, count };
      })
    );

    const flatActivities = populatedActivities
      .flat()
      .filter((d) => d.count !== -1);
    setActivities(flatActivities);

    const sumContributions = filteredActivities.reduce(
      (sum, activity) => sum + activity.count,
      0
    );
    setTotalContributions(sumContributions);

    setIsLoading(false);
  }, [dailyActivities, selectedYear]);

  // Memoize the grid rendering for performance
  const activityGrid = useMemo(() => {
    if (isLoading && activities.length === 0) {
      const skeletonGrid: DailyActivity[][] = Array.from(
        { length: 7 },
        () => []
      );
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 53; j++) {
          skeletonGrid[i].push({ date: `skeleton-${i}-${j}`, count: -2 }); // Use -2 for skeleton
        }
      }
      return skeletonGrid;
    }

    const dailyMap = new Map<string, number>();
    for (const c of activities) {
      dailyMap.set(c.date, c.count);
    }

    // Re-generate grid structure
    const yearGrid = generateYearGrid(selectedYear);

    // Populate the grid with actual data
    yearGrid.forEach((week, dayIdx) => {
      week.forEach((day, colIdx) => {
        if (day.count !== -1) {
          const count = dailyMap.get(day.date) || 0;
          yearGrid[dayIdx][colIdx] = { ...day, count };
        }
      });
    });

    return yearGrid;
  }, [activities, isLoading, selectedYear, generateYearGrid]);

  // Determine available years based on provided data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    dailyActivities.forEach((activity) => {
      years.add(new Date(activity.date).getFullYear());
    });
    const sortedYears = Array.from(years).sort((a, b) => b - a); // Sort descending
    return sortedYears.length > 0 ? sortedYears : [new Date().getFullYear()]; // Fallback to current year if no data
  }, [dailyActivities]);

  // Set initial selected year to the latest available year, or current year
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    } else if (
      availableYears.length === 0 &&
      selectedYear !== new Date().getFullYear()
    ) {
      setSelectedYear(new Date().getFullYear());
    }
  }, [availableYears, selectedYear]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              {totalContributions} Contributions in {selectedYear}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your GitHub contribution activity.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Select
              onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
              value={selectedYear.toString()}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              Fewer
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={`activity-level-${level}`}
                  className={`h-3 w-3 rounded-sm ${activityColors[level]}`}
                />
              ))}
              More
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <TooltipProvider delayDuration={0}>
          <div className="grid grid-flow-col auto-cols-min gap-1.5 min-w-max">
            <div className="grid grid-rows-7 gap-1.5 text-xs text-muted-foreground pt-[1.5em]">
              <div></div>
              <div className="text-right">Mon</div>
              <div></div>
              <div className="text-right">Wed</div>
              <div></div>
              <div className="text-right">Fri</div>
              <div></div>
            </div>

            {Array.from({ length: 53 }).map((_, weekIdx) => {
              const firstDayOfThisWeek = new Date(selectedYear, 0, 1);
              firstDayOfThisWeek.setDate(
                firstDayOfThisWeek.getDate() + weekIdx * 7
              );

              return (
                <div
                  key={`week-${selectedYear}-${weekIdx}`}
                  className="grid grid-rows-7 gap-1.5 auto-rows-min"
                >
                  <div className="text-center text-xs text-muted-foreground col-span-1 min-w-[13px]">
                    {isLoading ? (
                      <Skeleton className="h-3 w-6 mx-auto" />
                    ) : weekIdx === 0 ||
                      (firstDayOfThisWeek.getMonth() !==
                        new Date(
                          selectedYear,
                          0,
                          1 + (weekIdx - 1) * 7
                        ).getMonth() &&
                        firstDayOfThisWeek.getDay() === 1) ? (
                      months[firstDayOfThisWeek.getMonth()]
                    ) : (
                      ""
                    )}
                  </div>
                  {activityGrid.map((dayOfWeekData, dayIdx) => {
                    const day = dayOfWeekData[weekIdx];
                    if (!day)
                      return (
                        <div
                          key={`empty-${selectedYear}-${weekIdx}-${dayIdx}`}
                          className="h-3 w-3"
                        />
                      );

                    const level = getActivityLevel(day.count);
                    const colorClass = activityColors[level];
                    const tooltipDate = new Date(day.date);
                    const formattedDate = !Number.isNaN(tooltipDate.getTime())
                      ? tooltipDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "";

                    if (day.count === -1) {
                      return (
                        <div
                          key={day.date}
                          className="h-3 w-3 rounded-sm bg-transparent"
                        />
                      );
                    }

                    return (
                      <Tooltip key={`tooltip-${day.date}`}>
                        <TooltipTrigger asChild>
                          {isLoading ? (
                            <Skeleton className="h-3 w-3 rounded-sm" />
                          ) : (
                            <div
                              className={`h-3 w-3 rounded-sm ${colorClass} cursor-pointer transition-colors duration-200`}
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {day.count === 0
                            ? "No contributions"
                            : `${day.count} contribution${
                                day.count === 1 ? "" : "s"
                              }`}{" "}
                          on {formattedDate}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
