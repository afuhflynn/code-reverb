import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    // Get user repositories for filtering
    const userRepos = await prisma.repo.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            organization: {
              members: {
                some: { id: session.user.id },
              },
            },
          },
        ],
      },
      select: { id: true, name: true },
    });

    const repoIds = userRepos.map((repo) => repo.id);

    // Get total reviews count
    const totalReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
      },
    });

    // Get successful reviews (completed status)
    const successfulReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        status: "completed",
      },
    });

    // Calculate success rate
    const successRate =
      totalReviews > 0 ? (successfulReviews / totalReviews) * 100 : 0;

    // Get average review time
    const avgTimeResult = await prisma.run.aggregate({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        status: "completed",
        processingTime: { not: null },
      },
      _avg: {
        processingTime: true,
      },
    });

    const avgTime = avgTimeResult._avg.processingTime || 0;

    // Get weekly growth (compare this week vs last week)
    const now = new Date();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        createdAt: { gte: weekStart },
      },
    });

    const lastWeekReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        createdAt: {
          gte: twoWeeksAgo,
          lt: weekStart,
        },
      },
    });

    const weeklyGrowth =
      lastWeekReviews > 0
        ? ((thisWeekReviews - lastWeekReviews) / lastWeekReviews) * 100
        : 0;

    // Get change metrics (compare with previous period)
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo2 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentPeriodReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        createdAt: { gte: lastWeek },
      },
    });

    const previousPeriodReviews = await prisma.run.count({
      where: {
        pr: {
          repoId: { in: repoIds },
        },
        createdAt: {
          gte: twoWeeksAgo2,
          lt: lastWeek,
        },
      },
    });

    const totalChange =
      previousPeriodReviews > 0
        ? ((currentPeriodReviews - previousPeriodReviews) /
            previousPeriodReviews) *
          100
        : 0;

    return NextResponse.json({
      totalReviews,
      successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      avgTime: Math.round(avgTime / 1000), // Convert to seconds
      weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
      totalChange:
        totalChange > 0
          ? `+${Math.round(totalChange)}%`
          : `${Math.round(totalChange)}%`,
      currentPeriodReviews,
      previousPeriodReviews,
    });
  } catch (error) {
    console.error("Reviews stats GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review stats" },
      { status: 500 },
    );
  }
}
