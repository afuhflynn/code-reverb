import { NextResponse } from "next/server";
import qrcode from "qrcode";
import speakeasy from "speakeasy";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    // Generate a secret for TOTP
    const secret = speakeasy.generateSecret({
      name: `CodeReverb (${session.user.email} - ${session.user.name
        .split(" ")
        .slice(0, 2)
        .join(" ")})`,
      issuer: "CodeReverb",
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    // save secret and qrCode to db
    const twoFa = await prisma.tWOFA.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        qrCode: qrCodeUrl,
        secret: secret.base32,
      },
      create: {
        userId: session.user.id,
        qrCode: qrCodeUrl,
        secret: secret.base32,
      },
    });

    if (!twoFa) {
      return NextResponse.json(
        {
          error: "Failed to initialize two factor authenticatin.",
          success: false,
        },
        { status: 500 }
      );
    }
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
