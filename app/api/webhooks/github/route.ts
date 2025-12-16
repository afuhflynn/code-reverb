import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json({ message: "Pong" });
    }

    // TODO: Handle later
    return NextResponse.json({ message: "Event processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
