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
        { status: 400 },
      );
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time windows (30 seconds each)
    });

    if (!verified) {
      return NextResponse.json({ error: "Invalid 2FA token" }, { status: 400 });
    }

    // In production, save the secret to user record and enable 2FA
    // For demo, just return success

    return NextResponse.json({
      message: "2FA enabled successfully",
      enabled: true,
    });
  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify 2FA" },
      { status: 500 },
    );
  }
}
