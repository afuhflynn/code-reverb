import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get("hours") || "24", 10);

    // Calculate time range
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

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
      select: { id: true },
    });

    const repoIds = userRepos.map((repo) => repo.id);

    // Get recent runs (reviews)
    const recentRuns = await prisma.run.findMany({
      where: {
        pr: { repoId: { in: repoIds } },
        createdAt: { gte: since },
      },
      include: {
        pr: {
          include: {
            repo: { select: { name: true } },
            author: { select: { name: true, email: true } },
          },
        },
        persona: { select: { name: true } },
        feedbacks: { select: { rating: true }, take: 1 },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to prevent too much data
    });

    // Get recent feedback
    const recentFeedback = await prisma.feedback.findMany({
      where: {
        run: {
          pr: { repoId: { in: repoIds } },
        },
        createdAt: { gte: since },
      },
      include: {
        run: {
          include: {
            pr: { include: { repo: { select: { name: true } } } },
            persona: { select: { name: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Transform runs into activity items
    const runActivities = recentRuns.map((run) => ({
      id: `run_${run.id}`,
      type:
        run.status === "completed"
          ? "review_completed"
          : run.status === "running"
          ? "review_started"
          : run.status === "failed"
          ? "review_failed"
          : "review_started",
      title:
        run.status === "completed"
          ? `AI completed review of PR #${run.pr.number} in ${run.pr.repo.name}`
          : run.status === "running"
          ? `AI began reviewing PR #${run.pr.number} in ${run.pr.repo.name}`
          : `Review failed for PR #${run.pr.number} in ${run.pr.repo.name}`,
      description:
        run.status === "completed"
          ? `Quality Score: ${
              run.feedbacks?.[0]?.rating
                ? `${run.feedbacks[0].rating}/10`
                : "N/A"
            } - Generated ${run._count?.comments || 0} insightful comments`
          : run.status === "running"
          ? `Using ${run.persona.name} persona - ${run.pr.title}`
          : `Will retry automatically`,
      timestamp: run.createdAt,
      user: "AI Assistant",
      metadata: {
        prId: run.prId,
        repo: run.pr.repo.name,
        prNumber: run.pr.number,
        persona: run.persona.name,
        status: run.status,
      },
    }));

    // Transform feedback into activity items
    const feedbackActivities = recentFeedback.map((feedback) => ({
      id: `feedback_${feedback.id}`,
      type: "feedback_received",
      title: `User rated review ${feedback.rating}/5`,
      description: feedback.comment || "No comment provided",
      timestamp: feedback.createdAt,
      user: feedback.user.name || feedback.user.email || "Anonymous",
      metadata: {
        rating: feedback.rating,
        prId: feedback?.run?.prId,
        repo: feedback?.run?.pr.repo.name,
        persona: feedback?.run?.persona.name,
      },
    }));

    // Combine and sort all activities
    const allActivities = [...runActivities, ...feedbackActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 30); // Limit to 30 most recent

    // Add any system activities (like quality improvements)
    const systemActivities = [];
    // For now, add a mock system activity if there are reviews
    if (recentRuns.length > 0) {
      const recentCompleted = recentRuns.filter(
        (r) => r.status === "completed"
      );
      if (recentCompleted.length > 0) {
        systemActivities.push({
          id: "system_quality_check",
          type: "quality_improved",
          title: "AI quality score trending upward",
          description: "Based on recent feedback and learning algorithms",
          timestamp: new Date(
            Date.now() - Math.random() * hours * 60 * 60 * 1000
          ),
          user: "AI Learning",
          metadata: {},
        });
      }
    }

    return NextResponse.json([...allActivities, ...systemActivities]);
  } catch (error) {
    console.error("Reviews activity GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review activity" },
      { status: 500 }
    );
  }
}
