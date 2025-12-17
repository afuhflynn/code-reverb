import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { token, secret } = await request.json();

    if (!token || !secret) {
      return NextResponse.json(
        { error: "Token and secret are required" },
        { status: 400 }
      );
    }

    const twoFa = await prisma.tWOFA.findUnique({
      where: { userId: session.user.id, secret },
    });

    if (!twoFa) {
      return NextResponse.json(
        {
          error: "Failed to verify two factor authenticatin code.",
          success: false,
        },
        { status: 401 }
      );
    }
    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: twoFa.secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time windows (30 seconds each)
    });

    if (!verified) {
      return NextResponse.json({ error: "Invalid 2FA token" }, { status: 400 });
    }

    // update user twoFa record with the auth token
    const updatedTwoFa = await prisma.tWOFA.update({
      where: { userId: session.user.id },
      data: {
        token,
      },
    });

    if (!updatedTwoFa) {
      return NextResponse.json(
        {
          error: "Failed to verify two factor authenticatin code.",
          success: false,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "2FA enabled successfully",
      enabled: true,
    });
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify 2FA" },
      { status: 500 }
    );
  }
}
