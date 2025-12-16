import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        image: true,
        showEmail: true,
        showLocation: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
        githubUrl: data.githubUrl,
        showEmail: data.showEmail,
        showLocation: data.showLocation,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        image: true,
        showEmail: true,
        showLocation: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
