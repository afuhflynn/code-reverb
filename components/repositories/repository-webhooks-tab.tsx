import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RepositoryWebhooksTabProps {
  repositoryId: string;
}

export function RepositoryWebhooksTab({
  repositoryId,
}: RepositoryWebhooksTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Webhook configuration for repository {repositoryId} - Coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
