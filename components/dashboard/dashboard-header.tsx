import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, GitBranch, User, BarChart3, HelpCircle } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const displayName = user.name || user.email?.split("@")[0] || "Developer";

  return (
    <div
      id="dashboard-header"
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your AI-powered code review command center
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button id="quick-action-new-review" className="gap-2">
          <Plus className="h-4 w-4" />
          New Review
        </Button>
        <Button
          id="quick-action-connect-repo"
          variant="outline"
          className="gap-2"
        >
          <GitBranch className="h-4 w-4" />
          Connect Repository
        </Button>
        <Button
          id="quick-action-create-persona"
          variant="outline"
          className="gap-2"
        >
          <User className="h-4 w-4" />
          Create Persona
        </Button>
        <Button
          id="quick-action-view-analytics"
          variant="outline"
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          View Analytics
        </Button>
        <Button
          id="help-button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              (window as any).restartDashboardTour
            ) {
              (window as any).restartDashboardTour();
            }
          }}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
