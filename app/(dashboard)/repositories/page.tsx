"use client";

import { RepositoriesFilters } from "@/components/repositories/repositories-filters";
import { RepositoriesGrid } from "@/components/repositories/repositories-grid";
import { RepositoriesHeader } from "@/components/repositories/repositories-header";
import { RepositoriesList } from "@/components/repositories/repositories-list";
import { searchParamsSchema } from "@/nuqs";
import { useQueryStates } from "nuqs";

const RepositoriesPage = () => {
  const [params] = useQueryStates(searchParamsSchema);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <RepositoriesHeader />
        <RepositoriesFilters />
        {params.viewMode === "list" ? (
          <RepositoriesList />
        ) : (
          <RepositoriesGrid />
        )}
      </div>
    </div>
  );
};

export default RepositoriesPage;
