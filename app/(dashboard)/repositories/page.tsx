import { requireAuth } from "@/lib/auth-utils";
import { RepositoriesHeader } from "@/components/repositories/repositories-header";
import { RepositoriesFilters } from "@/components/repositories/repositories-filters";
import { RepositoriesGrid } from "@/components/repositories/repositories-grid";
import { RepositoriesActions } from "@/components/repositories/repositories-actions";

export default async function RepositoriesPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with title and connect button */}
        <RepositoriesHeader />

        {/* Filters and search */}
        <RepositoriesFilters />

        {/* Repository grid */}
        <RepositoriesGrid />

        {/* Bulk actions and pagination */}
        <RepositoriesActions />
      </div>
    </div>
  );
}
