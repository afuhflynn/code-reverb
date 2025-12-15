import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RepositoryAnalyticsTabProps {
  repositoryId: string;
}

export function RepositoryAnalyticsTab({
  repositoryId,
}: RepositoryAnalyticsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Analytics dashboard for repository {repositoryId} - Coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
