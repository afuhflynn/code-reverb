import { requireAuth } from "@/lib/auth-utils";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentPRsFeed } from "@/components/dashboard/recent-prs-feed";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { ActiveRepositories } from "@/components/dashboard/active-repositories";
import { ReviewQueue } from "@/components/dashboard/review-queue";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DashboardTour } from "@/components/dashboard/dashboard-tour";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Welcome and Quick Actions */}
        <DashboardHeader user={session.user} />

        {/* Stats Overview Cards */}
        <StatsOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent PRs Feed */}
          <div id="recent-prs-section">
            <RecentPRsFeed />
          </div>

          {/* AI Insights & Recommendations */}
          <div id="ai-insights-section">
            <AIInsights />
          </div>
        </div>

        {/* Bottom Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Repositories */}
          <div id="repositories-section">
            <ActiveRepositories />
          </div>

          {/* Review Queue */}
          <div id="review-queue-section">
            <ReviewQueue />
          </div>
        </div>

        {/* Activity Timeline */}
        <div id="activity-timeline-section">
          <ActivityTimeline />
        </div>
      </div>

      {/* Dashboard Tour Component */}
      <DashboardTour />
    </div>
  );
}
