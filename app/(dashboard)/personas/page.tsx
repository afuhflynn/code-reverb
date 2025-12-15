import { requireAuth } from "@/lib/auth-utils";
import { PersonasHeader } from "@/components/personas/personas-header";
import { PersonasSidebar } from "@/components/personas/personas-sidebar";
import { PersonaEditor } from "@/components/personas/persona-editor";
import { PersonasAnalytics } from "@/components/personas/personas-analytics";
import { CommunityPersonas } from "@/components/personas/community-personas";
import { PromptAssistant } from "@/components/personas/prompt-assistant";

export default async function PersonasPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with actions */}
        <PersonasHeader />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Personal personas library */}
          <div className="lg:col-span-1">
            <PersonasSidebar />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Persona editor (will be shown when persona is selected) */}
            <PersonaEditor />

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
