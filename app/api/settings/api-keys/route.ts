import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    const session = await requireAuth();

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        type: true,
        lastUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("API keys GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    // Generate a secure API key
    const apiKey = `cr_${randomBytes(32).toString("hex")}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name: data.name,
        key: apiKey,
        type: data.type || "api",
      },
      select: {
        id: true,
        name: true,
        type: true,
        key: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newApiKey);
  } catch (error) {
    console.error("API keys POST error:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 },
    );
  }
}
