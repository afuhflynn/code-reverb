"use client";

import { ActiveRepositories } from "@/components/dashboard/active-repositories";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTour } from "@/components/dashboard/dashboard-tour";
import { MultiActivityChart } from "@/components/dashboard/multi-activity-chart";
import { RecentPRsFeed } from "@/components/dashboard/recent-prs-feed";
import { ReviewQueue } from "@/components/dashboard/review-queue";
import { StatsOverview } from "@/components/dashboard/stats-overview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Welcome and Quick Actions */}
        <DashboardHeader />

        {/* Stats Overview Cards */}
        <StatsOverview />

        {/* GitHub Contribution Chart */}
        <ActivityChart />

        {/** TODO: Future features */}
        {/* Main Content Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
        {/* Recent PRs Feed */}
        {/* <div id="recent-prs-section">
            <RecentPRsFeed />
          </div> */}
        {/* Review Queue */}
        {/* <div id="review-queue-section">
            <ReviewQueue />
          </div> */}
        {/* </div> */}

        {/* Multi Activity Chart */}
        <div id="multi-activity-section">
          <MultiActivityChart />
        </div>
      </div>

      {/* Dashboard Tour Component */}
      <DashboardTour />
    </div>
  );
}
