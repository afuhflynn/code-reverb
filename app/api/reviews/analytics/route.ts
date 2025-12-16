import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "performance";

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

    if (type === "performance") {
      // Success rate by repository
      const successRateByRepo = await Promise.all(
        userRepos.map(async (repo) => {
          const total = await prisma.run.count({
            where: { pr: { repoId: repo.id } },
          });
          const successful = await prisma.run.count({
            where: {
              pr: { repoId: repo.id },
              status: "completed",
            },
          });
          const rate = total > 0 ? (successful / total) * 100 : 0;
          return {
            repository: repo.name,
            successRate: Math.round(rate * 100) / 100,
            total,
            successful,
          };
        }),
      );

      // Average review time by persona
      const personas = await prisma.persona.findMany({
        where: { userId: session.user.id },
        select: { id: true, name: true },
      });

      const avgTimeByPersona = await Promise.all(
        personas.map(async (persona) => {
          const result = await prisma.run.aggregate({
            where: {
              personaId: persona.id,
              pr: { repoId: { in: repoIds } },
              status: "completed",
              processingTime: { not: null },
            },
            _avg: { processingTime: true },
          });
          const avgTime = result._avg.processingTime || 0;
          return {
            persona: persona.name,
            avgTime: Math.round(avgTime / 1000), // Convert to seconds
          };
        }),
      );

      // Quality distribution
      const qualityRanges = [
        { label: "9-10 (Excellent)", min: 9, max: 10 },
        { label: "7-8.9 (Good)", min: 7, max: 8.9 },
        { label: "5-6.9 (Fair)", min: 5, max: 6.9 },
        { label: "0-4.9 (Poor)", min: 0, max: 4.9 },
      ];

      const qualityDistribution = await Promise.all(
        qualityRanges.map(async (range) => {
          const count = await prisma.feedback.count({
            where: {
              run: {
                pr: { repoId: { in: repoIds } },
              },
              rating: {
                gte: range.min,
                lte: range.max,
              },
            },
          });
          return {
            range: range.label,
            count,
            percentage: 0, // Will calculate after getting total
          };
        }),
      );

      const totalFeedback = qualityDistribution.reduce(
        (sum, item) => sum + item.count,
        0,
      );
      qualityDistribution.forEach((item) => {
        item.percentage =
          totalFeedback > 0
            ? Math.round((item.count / totalFeedback) * 100)
            : 0;
      });

      return NextResponse.json({
        successRateByRepo,
        avgTimeByPersona,
        qualityDistribution,
      });
    } else if (type === "insights") {
      // Get personas for insights
      const personas = await prisma.persona.findMany({
        where: { userId: session.user.id },
        select: { id: true, name: true },
      });

      // AI Accuracy Matrix
      const totalReviews = await prisma.run.count({
        where: { pr: { repoId: { in: repoIds } } },
      });

      const truePositives = Math.floor(totalReviews * 0.94); // Mock data for now
      const falsePositives = Math.floor(totalReviews * 0.031);
      const trueNegatives = Math.floor(totalReviews * 0.897);
      const falseNegatives = Math.floor(totalReviews * 0.028);

      // Persona effectiveness
      const personaEffectiveness = await Promise.all(
        personas.map(async (persona) => {
          const personaRuns = await prisma.run.count({
            where: { personaId: persona.id, pr: { repoId: { in: repoIds } } },
          });
          const personaSuccess = await prisma.run.count({
            where: {
              personaId: persona.id,
              pr: { repoId: { in: repoIds } },
              status: "completed",
            },
          });
          const effectiveness =
            personaRuns > 0 ? (personaSuccess / personaRuns) * 100 : 0;
          return {
            persona: persona.name,
            effectiveness: Math.round(effectiveness * 100) / 100,
          };
        }),
      );

      return NextResponse.json({
        accuracyMatrix: {
          truePositives,
          falsePositives,
          trueNegatives,
          falseNegatives,
        },
        personaEffectiveness,
      });
    }

    return NextResponse.json(
      { error: "Invalid analytics type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Reviews analytics GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review analytics" },
      { status: 500 },
    );
  }
}
