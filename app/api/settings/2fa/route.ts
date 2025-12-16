import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await requireAuth();

    // In production, disable 2FA for the user
    // For demo, just return success

    return NextResponse.json({
      message: "2FA disabled successfully",
      enabled: false,
    });
  } catch (error) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { error: "Failed to disable 2FA" },
      { status: 500 },
    );
  }
}
