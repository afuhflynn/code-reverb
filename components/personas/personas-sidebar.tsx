import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MoreHorizontal, Play, Edit, Trash2, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const mockPersonas = [
  {
    id: "persona_001",
    name: "Code Quality Expert",
    description:
      "Comprehensive reviewer focused on best practices, clean code, and maintainability",
    specialty: "code-quality",
    avatar: "🎯",
    reviewCount: 247,
    avgQuality: 9.2,
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isActive: true,
    isDefault: true,
    tags: ["best-practices", "clean-code"],
  },
  {
    id: "persona_002",
    name: "Security Guardian",
    description:
      "Vigilant protector against security vulnerabilities and exploits",
    specialty: "security",
    avatar: "🛡️",
    reviewCount: 189,
    avgQuality: 9.5,
    lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isActive: true,
    isDefault: true,
    tags: ["security", "vulnerabilities"],
  },
  {
    id: "persona_003",
    name: "Performance Optimizer",
    description:
      "Efficiency expert optimizing for speed, memory, and scalability",
    specialty: "performance",
    avatar: "⚡",
    reviewCount: 156,
    avgQuality: 8.9,
    lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isActive: false,
    isDefault: true,
    tags: ["performance", "optimization"],
  },
  {
    id: "persona_004",
    name: "React Specialist",
    description: "Expert in React patterns, hooks, and component architecture",
    specialty: "code-quality",
    avatar: "⚛️",
    reviewCount: 89,
    avgQuality: 9.1,
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isActive: true,
    isDefault: false,
    tags: ["react", "frontend", "hooks"],
  },
  {
    id: "persona_005",
    name: "TypeScript Guru",
    description:
      "TypeScript expert focusing on type safety and advanced patterns",
    specialty: "code-quality",
    avatar: "🔷",
    reviewCount: 67,
    avgQuality: 9.3,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isActive: true,
    isDefault: false,
    tags: ["typescript", "types", "safety"],
  },
];

const getSpecialtyColor = (specialty: string) => {
  const colors: Record<string, string> = {
    "code-quality": "bg-blue-100 text-blue-800",
    security: "bg-red-100 text-red-800",
    performance: "bg-orange-100 text-orange-800",
    documentation: "bg-purple-100 text-purple-800",
    testing: "bg-green-100 text-green-800",
    accessibility: "bg-pink-100 text-pink-800",
    architecture: "bg-indigo-100 text-indigo-800",
  };
  return colors[specialty] || "bg-gray-100 text-gray-800";
};

export function PersonasSidebar() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Personas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPersonas.map((persona) => (
            <div
              key={persona.id}
              className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">
                      {persona.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {persona.name}
                      </span>
                      {persona.isDefault && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          Default
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSpecialtyColor(persona.specialty)}`}
                    >
                      {persona.specialty.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {persona.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{persona.reviewCount} reviews</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{persona.avgQuality}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {persona.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(persona.lastUsed, { addSuffix: true })}
                </span>
              </div>

              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs px-2"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs px-2"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Test
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Persona
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Persona
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
