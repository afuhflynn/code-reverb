import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromptAssistant() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Optimization Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          AI-powered prompt optimization and best practice suggestions - Coming
          soon!
        </p>
      </CardContent>
    </Card>
  );
}
