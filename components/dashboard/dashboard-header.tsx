"use client";

import { Button } from "@/components/ui/button";
import { GitBranch, User, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Developer";

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
        <Button
          id="quick-action-connect-repo"
          variant="outline"
          className="gap-2"
          asChild
        >
          <Link href="/repositories">
            <GitBranch className="h-4 w-4" />
            Connect Repository
          </Link>
        </Button>
        <Button
          id="quick-action-create-persona"
          variant="outline"
          className="gap-2"
          asChild
        >
          <Link href="/personas">
            <User className="h-4 w-4" />
            Create Persona
          </Link>
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
