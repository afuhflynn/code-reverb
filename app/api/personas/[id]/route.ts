import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const updatePersonaSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long")
    .optional(),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(10000, "Prompt too long")
    .optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    const persona = await prisma.persona.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        runs: {
          select: {
            id: true,
            status: true,
            processingTime: true,
            tokensUsed: true,
            modelUsed: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!persona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    // Calculate additional stats
    const totalRuns = persona.runs.length;
    const successfulRuns = persona.runs.filter(
      (r) => r.status === "completed"
    ).length;
    const avgQuality = totalRuns > 0 ? (successfulRuns / totalRuns) * 10 : 0;
    const totalTokens = persona.runs.reduce(
      (acc, run) => acc + (run.tokensUsed || 0),
      0
    );
    const avgProcessingTime =
      persona.runs.length > 0
        ? persona.runs.reduce(
            (acc, run) => acc + (run.processingTime || 0),
            0
          ) / persona.runs.length
        : 0;

    return NextResponse.json({
      ...persona,
      stats: {
        totalRuns,
        successfulRuns,
        avgQuality: Math.round(avgQuality * 10) / 10,
        totalTokens,
        avgProcessingTime: Math.round(avgProcessingTime),
      },
    });
  } catch (error) {
    console.error("Persona GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch persona" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validationResult = updatePersonaSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const persona = await prisma.persona.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!persona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    const updatedPersona = await prisma.persona.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return NextResponse.json(updatedPersona);
  } catch (error) {
    console.error("Persona PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update persona" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    const persona = await prisma.persona.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!persona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    // Check if persona is being used in any runs
    const runCount = await prisma.run.count({
      where: { personaId: params.id },
    });

    if (runCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete persona that has been used in reviews" },
        { status: 400 }
      );
    }

    await prisma.persona.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Persona DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete persona" },
      { status: 500 }
    );
  }
}
