import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonasAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Persona Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          ML insights and performance analytics for your personas - Coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
