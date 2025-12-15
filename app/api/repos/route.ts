import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repos = await (prisma as any).repo.findMany({
      where: { ownerId: session.user.id },
      include: {
        prs: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("Failed to fetch repos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, githubId } = await request.json();

    if (!fullName || !githubId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if repo already exists
    const existingRepo = await (prisma as any).repo.findUnique({
      where: { githubId: githubId.toString() },
    });

    if (existingRepo) {
      return NextResponse.json(
        { error: "Repository already connected" },
        { status: 409 },
      );
    }

    const repo = await (prisma as any).repo.create({
      data: {
        name: fullName.split("/")[1],
        fullName,
        githubId: githubId.toString(),
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ repo }, { status: 201 });
  } catch (error) {
    console.error("Failed to create repo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
