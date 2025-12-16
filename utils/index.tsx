import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, GitBranch } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "py-4 bg-green-100/90 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-100 text-blue-800",
    Go: "bg-cyan-100 text-cyan-800",
    Python: "bg-yellow-100 text-yellow-800",
    "Node.js": "bg-green-100 text-green-800",
    Markdown: "bg-gray-100 text-gray-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
};

// Empty state component
export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No repositories found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </CardContent>
    </Card>
  );
}

// Error state component
export function ErrorState() {
  return (
    <Card className="border-destructive">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-semibold text-lg mb-2">
          Failed to load repositories
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There was an error loading your repositories. Please try again later.
        </p>
      </CardContent>
    </Card>
  );
}
