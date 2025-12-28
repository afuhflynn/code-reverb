import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireAuth();
    const repoId = params.id;

    // Ensure the repo belongs to this user/owner
    const repo = await prisma.repo.findFirst({
      where: {
        id: repoId,
        ownerId: session.user.id,
      },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    await prisma.repo.delete({
      where: { id: repo.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings repository DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect repository" },
      { status: 500 },
    );
  }
}
