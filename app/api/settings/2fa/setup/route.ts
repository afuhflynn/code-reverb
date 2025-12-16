import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

export async function POST() {
  try {
    const session = await requireAuth();

    // Generate a secret for TOTP
    const secret = speakeasy.generateSecret({
      name: `Code-Reverb (${session.user.email})`,
      issuer: "Code-Reverb",
    });

    // Store the secret temporarily (in production, you'd store it securely)
    // For demo, we'll just return it - in real app, save to user record with temp flag

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: "Scan the QR code with your authenticator app",
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json({ error: "Failed to setup 2FA" }, { status: 500 });
  }
}
