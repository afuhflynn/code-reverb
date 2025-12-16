"use client";

import { useState } from "react";
import { CommunityPersonas } from "@/components/personas/community-personas";
import { PersonaEditor } from "@/components/personas/persona-editor";
import { PersonasAnalytics } from "@/components/personas/personas-analytics";
import { PersonasHeader } from "@/components/personas/personas-header";
import { PersonasSidebar } from "@/components/personas/personas-sidebar";
import { PromptAssistant } from "@/components/personas/prompt-assistant";

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

export default function PersonasPage() {
  const [selectedPersona, setSelectedPersona] =
    useState<PersonaWithStats | null>(null);

  const handleSelectPersona = (persona: PersonaWithStats) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with actions */}
        <PersonasHeader />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Personal personas library */}
          <div className="lg:col-span-1">
            <PersonasSidebar
              onSelectPersona={handleSelectPersona}
              selectedPersonaId={selectedPersona?.id}
            />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Persona editor (will be shown when persona is selected) */}
            <PersonaEditor selectedPersona={selectedPersona} />

            {/* Analytics dashboard */}
            <PersonasAnalytics />

            {/* Community personas (organization access) */}
            <CommunityPersonas />

            {/* Prompt optimization assistant */}
            <PromptAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}
