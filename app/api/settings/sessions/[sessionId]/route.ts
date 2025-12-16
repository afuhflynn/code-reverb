import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const session = await requireAuth();

    // For demo purposes, just return success
    // In production, you'd revoke the specific session

    return NextResponse.json({ message: "Session revoked successfully" });
  } catch (error) {
    console.error("Session revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 },
    );
  }
}
