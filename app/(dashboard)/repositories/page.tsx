"use client";

import { useState } from "react";
import { RepositoriesHeader } from "@/components/repositories/repositories-header";
import { RepositoriesFilters } from "@/components/repositories/repositories-filters";
import { RepositoriesGrid } from "@/components/repositories/repositories-grid";
import { RepositoriesList } from "@/components/repositories/repositories-list";
import { RepositoriesActions } from "@/components/repositories/repositories-actions";

export default function RepositoriesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const handleRepoSelect = (repoId: number, selected: boolean) => {
    if (selected) {
      setSelectedRepos((prev) => [...prev, repoId]);
    } else {
      setSelectedRepos((prev) => prev.filter((id) => id !== repoId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      // This will be handled by the components since they filter the data
      // For now, select all visible repos (simplified)
      setSelectedRepos([1, 2, 3, 4, 5, 6]);
    } else {
      setSelectedRepos([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with title and connect button */}
        <RepositoriesHeader />

        {/* Filters and search */}
        <RepositoriesFilters
          selectedCount={selectedRepos.length}
          totalCount={6} // Will be updated when we implement proper filtering
          onSelectAll={handleSelectAll}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          languageFilter={languageFilter}
          onLanguageChange={setLanguageFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Repository view */}
        {viewMode === "grid" ? (
          <RepositoriesGrid
            selectedRepos={selectedRepos}
            onRepoSelect={handleRepoSelect}
            onSelectAll={handleSelectAll}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            languageFilter={languageFilter}
            sortBy={sortBy}
          />
        ) : (
          <RepositoriesList
            selectedRepos={selectedRepos}
            onRepoSelect={handleRepoSelect}
            onSelectAll={handleSelectAll}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            languageFilter={languageFilter}
            sortBy={sortBy}
          />
        )}

        {/* Bulk actions and pagination */}
        <RepositoriesActions
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedRepos.length}
          totalCount={6} // Will be updated when we implement proper filtering
        />
      </div>
    </div>
  );
}
