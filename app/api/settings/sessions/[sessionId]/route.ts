import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const currentToken = session.session.token;
    const { sessionId } = await params;
    const sessionToRevoke = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    // Prevent revoking current session
    if (sessionToRevoke?.token === currentToken) {
      return NextResponse.json(
        { error: "Cannot revoke current session" },
        { status: 400 }
      );
    }

    await prisma.session.delete({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Session revoked successfully" });
  } catch (error) {
    console.error("Session revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
