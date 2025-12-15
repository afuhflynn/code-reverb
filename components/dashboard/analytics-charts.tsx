"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          Charts will be implemented with Recharts
        </div>
      </CardContent>
    </Card>
  );
}
