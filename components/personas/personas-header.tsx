import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Sparkles } from "lucide-react";

export function PersonasHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My AI Personas</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your personal AI code reviewers
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Persona
        </Button>
      </div>
    </div>
  );
}
