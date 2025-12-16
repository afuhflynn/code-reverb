import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // First check if the API key belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API key DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}
