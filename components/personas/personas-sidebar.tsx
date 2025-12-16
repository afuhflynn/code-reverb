"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
  Copy,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePersonas, useDeletePersona } from "@/hooks";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PersonaWithStats {
  id: string;
  name: string;
  description: string;
  specialty: string;
  avatar: string;
  reviewCount: number;
  avgQuality: number;
  lastUsed: Date;
  isActive: boolean;
  isDefault: boolean;
  tags: string[];
}

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

interface PersonasSidebarProps {
  onSelectPersona?: (persona: PersonaWithStats) => void;
  selectedPersonaId?: string;
}

export function PersonasSidebar({
  onSelectPersona,
  selectedPersonaId,
}: PersonasSidebarProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePersonas();
  const deletePersona = useDeletePersona();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const allPersonas = data?.pages.flatMap((page) => page.personas) || [];

  const handleDeletePersona = async (personaId: string) => {
    if (confirm("Are you sure you want to delete this persona?")) {
      setDeletingId(personaId);
      try {
        await deletePersona.mutateAsync(personaId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Failed to load personas. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">My Personas</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full mb-2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))
          ) : allPersonas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">
                No personas yet. Create your first AI reviewer!
              </p>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Persona
              </Button>
            </div>
          ) : (
            allPersonas.map((persona: PersonaWithStats) => (
              <div
                key={persona.id}
                className={`p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer ${
                  selectedPersonaId === persona.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectPersona?.(persona)}
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
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0"
                          >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement test functionality
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  {!persona.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePersona(persona.id);
                      }}
                      disabled={deletingId === persona.id}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      {deletingId === persona.id ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          {hasNextPage && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
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
