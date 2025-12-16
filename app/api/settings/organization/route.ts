import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();

    // Check if user is admin or owner of an organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        organizationId: true,
        ownedOrganizations: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user owns organizations, return the first one (for simplicity)
    if (user.ownedOrganizations.length > 0) {
      const org = user.ownedOrganizations[0];
      return NextResponse.json({
        id: org.id,
        name: org.name,
        description: org.description,
        members: org.members,
        isOwner: true,
      });
    }

    // If user is member of an organization
    if (user.organizationId) {
      const org = await prisma.organization.findUnique({
        where: { id: user.organizationId },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (org) {
        return NextResponse.json({
          id: org.id,
          name: org.name,
          description: org.description,
          members: org.members,
          owner: org.owner,
          isOwner: false,
        });
      }
    }

    return NextResponse.json(
      { error: "No organization found" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Organization GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    // Check if user owns an organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        ownedOrganizations: {
          select: { id: true },
        },
      },
    });

    if (!user || user.ownedOrganizations.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized to update organization" },
        { status: 403 },
      );
    }

    const orgId = user.ownedOrganizations[0].id;

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: org.id,
      name: org.name,
      description: org.description,
      members: org.members,
      isOwner: true,
    });
  } catch (error) {
    console.error("Organization PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 },
    );
  }
}
