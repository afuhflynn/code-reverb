"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockPRs = [
  {
    id: "1",
    title: "Add user authentication",
    repo: "my-app",
    author: { name: "John Doe", avatar: "" },
    status: "reviewing",
    priority: "high",
  },
  {
    id: "2",
    title: "Fix database connection",
    repo: "backend",
    author: { name: "Jane Smith", avatar: "" },
    status: "pending",
    priority: "medium",
  },
];

export function PRFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent PRs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockPRs.map((pr) => (
          <div key={pr.id} className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={pr.author.avatar} />
              <AvatarFallback>{pr.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{pr.title}</p>
              <p className="text-sm text-muted-foreground">
                {pr.repo} • {pr.author.name}
              </p>
            </div>
            <div className="flex space-x-2">
              <Badge
                variant={pr.status === "reviewing" ? "default" : "secondary"}
              >
                {pr.status}
              </Badge>
              <Badge
                variant={pr.priority === "high" ? "destructive" : "outline"}
              >
                {pr.priority}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
