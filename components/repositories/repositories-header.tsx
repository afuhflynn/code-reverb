import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Github, Settings } from "lucide-react";

export function RepositoriesHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all your connected repositories
        </p>
      </div>
    </div>
  );
}
