import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  GitBranch,
  FileText,
  Target,
  Clock,
} from "lucide-react";

const statsData = [
  {
    title: "Total Reviews",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    period: "Last 30 days",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Active Repositories",
    value: "15",
    subtitle: "8 connected",
    additional: "7 pending setup",
    icon: GitBranch,
    color: "text-green-600",
  },
  {
    title: "AI Accuracy Score",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    period: "This month",
    icon: Target,
    color: "text-purple-600",
  },
  {
    title: "Time Saved",
    value: "42.5 hrs",
    change: "+8.2 hrs",
    changeType: "positive" as const,
    period: "This week",
    icon: Clock,
    color: "text-orange-600",
  },
];

export function StatsOverview() {
  return (
    <div
      id="stats-overview-section"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statsData.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
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
                <span className="text-muted-foreground">{stat.period}</span>
              </div>
            )}
            {stat.subtitle && (
              <div className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </div>
            )}
            {stat.additional && (
              <div className="text-xs text-orange-600 mt-1">
                {stat.additional}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
