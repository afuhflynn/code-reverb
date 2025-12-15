"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const aiInsights = [
  {
    type: "recommendation",
    icon: Lightbulb,
    title: "Consider reviewing PR #123 in 'api-service'",
    description:
      "High complexity changes detected that would benefit from AI analysis",
    priority: "high",
    action: "Start Review",
  },
  {
    type: "alert",
    icon: AlertTriangle,
    title: "Multiple repositories have outdated dependencies",
    description: "5 repositories have security vulnerabilities in dependencies",
    priority: "medium",
    action: "View Details",
  },
  {
    type: "suggestion",
    icon: Zap,
    title: "Try the 'Security Expert' persona",
    description:
      "Based on your recent reviews, this persona would improve code security detection",
    priority: "low",
    action: "Switch Persona",
  },
  {
    type: "insight",
    icon: TrendingUp,
    title: "Your review completion time is 23% faster than average",
    description: "Great job! You're reviewing code more efficiently this month",
    priority: "info",
    action: "View Stats",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "info":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "recommendation":
      return "text-blue-600";
    case "alert":
      return "text-red-600";
    case "suggestion":
      return "text-purple-600";
    case "insight":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export function AIInsights() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiInsights.map((insight) => (
          <div
            key={insight.title}
            className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full bg-muted ${getIconColor(insight.type)}`}
              >
                <insight.icon className="h-4 w-4" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority}
                  </Badge>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    if (insight.action === "Start Review")
                      router.push("/repositories");
                    else if (insight.action === "Switch Persona")
                      router.push("/personas");
                    else if (insight.action === "View Stats")
                      router.push("/reviews");
                    else router.push("/repositories");
                  }}
                >
                  {insight.action}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              AI insights powered by Gemini & OpenAI
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings")}
            >
              Customize AI Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
