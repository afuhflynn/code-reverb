import { ActiveRepositories } from "@/components/dashboard/active-repositories";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTour } from "@/components/dashboard/dashboard-tour";
import { MultiActivityChart } from "@/components/dashboard/multi-activity-chart";
import { RecentPRsFeed } from "@/components/dashboard/recent-prs-feed";
import { ReviewQueue } from "@/components/dashboard/review-queue";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { requireAuth } from "@/lib/auth-utils";

// Generate dummy data for GitHub contributions
const generateDummyContributions = () => {
  const data = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear() - 2, 0, 1); // Last 3 years
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    // Random contributions: 0-15
    const count = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 16);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// Generate dummy data for multi-activity chart (last 3 months, weekly)
const generateDummyMultiActivity = () => {
  const data = [];
  const now = new Date();
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

  let currentDate = new Date(startDate);
  while (currentDate <= now) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      commits: Math.floor(Math.random() * 20),
      pullRequests: Math.floor(Math.random() * 5),
      aiReviews: Math.floor(Math.random() * 10),
    });
    currentDate.setDate(currentDate.getDate() + 7); // Weekly
  }
  return data;
};

export default async function DashboardPage() {
  const session = await requireAuth("/app");

  const dailyContributions = generateDummyContributions();
  const multiActivityData = generateDummyMultiActivity();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Welcome and Quick Actions */}
        <DashboardHeader user={session.user} />

        {/* Stats Overview Cards */}
        <StatsOverview />

        {/* GitHub Contribution Chart */}
        <ActivityChart dailyActivities={dailyContributions} />

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

        {/* Multi Activity Chart */}
        <div id="multi-activity-section">
          <MultiActivityChart data={multiActivityData} />
        </div>
      </div>

      {/* Dashboard Tour Component */}
      <DashboardTour />
    </div>
  );
}
