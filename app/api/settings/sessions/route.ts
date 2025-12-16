import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// Mock session data - in a real app, you'd use Redis or similar for session storage
export async function GET() {
  try {
    const session = await requireAuth();

    // For demo purposes, return mock session data
    // In production, you'd query your session store
    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
    });

    console.log({ sessions });
    const mockSessions = [
      {
        id: "current-session",
        device: "Chrome on MacBook Pro",
        location: "San Francisco, CA",
        lastActive: new Date().toISOString(),
        current: true,
      },
      {
        id: "session-2",
        device: "Safari on iPhone",
        location: "San Francisco, CA",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        current: false,
      },
    ];

    return NextResponse.json(mockSessions);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();

    // For demo purposes, just return success
    // In production, you'd revoke all sessions except current

    return NextResponse.json({ message: "All sessions revoked successfully" });
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to revoke sessions" },
      { status: 500 }
    );
  }
}
