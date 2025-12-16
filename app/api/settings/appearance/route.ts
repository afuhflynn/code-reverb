import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        appearanceSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.appearanceSettings as object);
  } catch (error) {
    console.error("Appearance settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appearance settings" },
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
        appearanceSettings: data,
      },
      select: {
        appearanceSettings: true,
      },
    });

    return NextResponse.json(user.appearanceSettings as object);
  } catch (error) {
    console.error("Appearance settings PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update appearance settings" },
      { status: 500 },
    );
  }
}
