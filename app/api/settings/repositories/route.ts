import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    const repos = await prisma.repo.findMany({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        fullName: true,
        provider: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return NextResponse.json(repos);
  } catch (error) {
    console.error("Settings repositories GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connected repositories" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Disconnect all repos for this owner
    await prisma.repo.deleteMany({
      where: {
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings repositories DELETE all error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect repositories" },
      { status: 500 },
    );
  }
}
