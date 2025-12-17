import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

// Helper function to parse user agent and get device info
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown Browser";
  const os = result.os.name || "Unknown OS";
  const device = result.device.type
    ? `${result.device.vendor || ""} ${result.device.model || ""}`.trim()
    : os.includes("Mac")
    ? "MacBook Pro"
    : os.includes("Windows")
    ? "Windows PC"
    : os.includes("Linux")
    ? "Linux PC"
    : os.includes("iOS")
    ? "iPhone"
    : os.includes("Android")
    ? "Android Device"
    : "Desktop";

  return `${browser} on ${device}`;
}

// Helper function to format location from IP (you'd use a GeoIP service in production)
function getLocationFromIP(ipAddress: string) {
  // For localhost/development, return a default location
  if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
    return "Local Development";
  }

  // In production, integrate with a GeoIP service like:
  // - MaxMind GeoIP2
  // - ipapi.co
  // - ip-api.com
  return "Unknown Location";
}

// Helper function to format "time ago"
function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Active now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Get current session token from cookie
    const currentToken = request.cookies.get("session")?.value;

    // Fetch all sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() }, // Only active sessions
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform sessions to match UI format
    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      device: parseUserAgent(s?.userAgent as string),
      location: getLocationFromIP(s?.ipAddress as string),
      lastActive: getTimeAgo(s.updatedAt),
      lastActiveISO: s.updatedAt.toISOString(),
      current: s.token === currentToken,
      createdAt: s.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const currentToken = request.cookies.get("session")?.value;

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      // Revoke specific session
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
    } else {
      // Revoke all sessions except current
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          token: { not: currentToken },
        },
      });

      return NextResponse.json({
        message: "All other sessions revoked successfully",
      });
    }
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to revoke sessions" },
      { status: 500 }
    );
  }
}
