import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    // Parse filters
    const status = searchParams.get("status");
    const repository = searchParams.get("repository");
    const persona = searchParams.get("persona");
    const qualityScore = searchParams.get("qualityScore");
    const dateRange = searchParams.get("dateRange");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    // Only show reviews from repositories the user has access to
    where.pr = {
      repo: {
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
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (repository && repository !== "all") {
      where.pr = {
        ...where.pr,
        repo: {
          ...where.pr.repo,
          name: repository,
        },
      };
    }

    if (persona && persona !== "all") {
      where.persona = { name: persona };
    }

    if (qualityScore && qualityScore !== "all") {
      let minScore: number, maxScore: number;
      switch (qualityScore) {
        case "excellent":
          minScore = 9;
          maxScore = 10;
          break;
        case "good":
          minScore = 7;
          maxScore = 8.9;
          break;
        case "fair":
          minScore = 5;
          maxScore = 6.9;
          break;
        case "poor":
          minScore = 0;
          maxScore = 4.9;
          break;
        default:
          minScore = 0;
          maxScore = 10;
      }

      where.feedbacks = {
        some: {
          rating: {
            gte: minScore,
            lte: maxScore,
          },
        },
      };
    }

    // Date filtering
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          startDate = new Date(
            now.getFullYear(),
            Math.floor(now.getMonth() / 3) * 3,
            1,
          );
          break;
        default:
          startDate = new Date(0);
      }

      where.createdAt = { gte: startDate };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { pr: { title: { contains: search, mode: "insensitive" } } },
        { pr: { description: { contains: search, mode: "insensitive" } } },
        { pr: { repo: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }

    // Get runs with related data
    const runs = await prisma.run.findMany({
      where,
      include: {
        pr: {
          include: {
            author: { select: { name: true, email: true } },
            repo: { select: { name: true, fullName: true } },
          },
        },
        persona: { select: { name: true } },
        feedback: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform data for frontend
    const reviews = runs.map((run) => ({
      id: run.id,
      repository: run.pr.repo.name,
      prNumber: run.pr.number,
      title: run.pr.title,
      status: run.status,
      qualityScore: run.feedback?.[0]?.rating || null,
      persona: run.persona.name,
      duration: run.processingTime
        ? `${Math.round(run.processingTime / 1000)}s`
        : "-",
      createdAt: run.createdAt,
      author: run.pr.author.name || run.pr.author.email,
      commentCount: run._count.comments,
    }));

    // Get total count for pagination
    const total = await prisma.run.count({ where });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    // This would trigger a new review - for now just return success
    // In a real implementation, this would queue a review job

    return NextResponse.json({
      message: "Review initiated successfully",
      reviewId: `review_${Date.now()}`,
    });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { error: "Failed to initiate review" },
      { status: 500 },
    );
  }
}
