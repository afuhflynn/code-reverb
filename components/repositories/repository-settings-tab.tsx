import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RepositorySettingsTabProps {
  repositoryId: string;
}

export function RepositorySettingsTab({
  repositoryId,
}: RepositorySettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Settings for repository {repositoryId} - Coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
