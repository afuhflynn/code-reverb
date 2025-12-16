import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        aiSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.aiSettings as object);
  } catch (error) {
    console.error("AI settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        aiSettings: data,
      },
      select: {
        aiSettings: true,
      },
    });

    return NextResponse.json(user.aiSettings as object);
  } catch (error) {
    console.error("AI settings PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update AI settings" },
      { status: 500 },
    );
  }
}
