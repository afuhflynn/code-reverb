import { requireAuth } from "@/lib/auth-utils";
import { ReviewsHeader } from "@/components/reviews/reviews-header";
import { ReviewsFilters } from "@/components/reviews/reviews-filters";
import { ReviewsTable } from "@/components/reviews/reviews-table";
import { ReviewsAnalyticsTabs } from "@/components/reviews/reviews-analytics-tabs";
import { ReviewsActivityTimeline } from "@/components/reviews/reviews-activity-timeline";

export default async function ReviewsPage() {
  const session = await requireAuth("/reviews");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with stats and bulk actions */}
        <ReviewsHeader />

        {/* Advanced filters and search */}
        <ReviewsFilters />

        {/* Main reviews table */}
        <ReviewsTable />

        {/* Analytics tabs */}
        <ReviewsAnalyticsTabs />

        {/* Activity timeline */}
        <ReviewsActivityTimeline />
      </div>
    </div>
  );
}
