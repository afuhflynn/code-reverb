import { requireAuth } from "@/lib/auth-utils";
import { RepositoryHeader } from "@/components/repositories/repository-header";
import { RepositoryTabs } from "@/components/repositories/repository-tabs";

interface RepositoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const session = await requireAuth("/repositories");
  const { id } = await params;

  // In a real app, you'd fetch repository data based on the ID
  const mockRepository = {
    id,
    name: `repo-${id}`,
    fullName: `myorg/repo-${id}`,
    description: `Repository ${id} description`,
    status: "connected",
    language: "TypeScript",
    stars: 42,
    forks: 8,
    openPRs: 3,
    lastActivity: new Date(),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Repository Header */}
        <RepositoryHeader repository={mockRepository} />

        {/* Repository Tabs */}
        <RepositoryTabs repositoryId={id} />
      </div>
    </div>
  );
}
