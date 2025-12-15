"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Bot } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Repository
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" />
          New PR Review
        </Button>
      </CardContent>
    </Card>
  );
}
