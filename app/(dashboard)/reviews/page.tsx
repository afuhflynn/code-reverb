"use client";

import { useState } from "react";
import { ReviewsActivityTimeline } from "@/components/reviews/reviews-activity-timeline";
import { ReviewsAnalyticsTabs } from "@/components/reviews/reviews-analytics-tabs";
import { ReviewsFilters } from "@/components/reviews/reviews-filters";
import { ReviewsHeader } from "@/components/reviews/reviews-header";
import { ReviewsTable } from "@/components/reviews/reviews-table";

export default function ReviewsPage() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with stats and bulk actions */}
        <ReviewsHeader />

        {/* Advanced filters and search */}
        <ReviewsFilters
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1); // Reset to first page when filters change
          }}
        />

        {/* Main reviews table */}
        <ReviewsTable
          filters={{ ...filters, page: currentPage }}
          onPageChange={setCurrentPage}
        />

        {/* Analytics tabs */}
        <ReviewsAnalyticsTabs />

        {/* Activity timeline */}
        <ReviewsActivityTimeline />
      </div>
    </div>
  );
}
