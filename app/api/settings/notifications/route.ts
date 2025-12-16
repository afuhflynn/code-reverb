import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        inAppNotifications: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      email: user.emailNotifications as object,
      inApp: user.inAppNotifications as object,
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
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
        emailNotifications: data.email,
        inAppNotifications: data.inApp,
      },
      select: {
        emailNotifications: true,
        inAppNotifications: true,
      },
    });

    return NextResponse.json({
      email: user.emailNotifications as object,
      inApp: user.inAppNotifications as object,
    });
  } catch (error) {
    console.error("Notifications PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 },
    );
  }
}
