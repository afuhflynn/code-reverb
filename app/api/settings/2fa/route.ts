import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await requireAuth();

    const twoFa = await prisma.tWOFA.findUnique({
      where: { userId: session.user.id },
    });

    if (!twoFa) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
          success: false,
        },
        { status: 401 }
      );
    }

    const deletedTwoFa = await prisma.tWOFA.delete({
      where: { userId: session.user.id },
    });
    if (!deletedTwoFa) {
      return NextResponse.json(
        {
          error: "An unexpected error occurred.",
          success: false,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "2FA disabled successfully",
      enabled: false,
    });
  } catch (error) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { error: "Failed to disable 2FA" },
      { status: 500 }
    );
  }
}
