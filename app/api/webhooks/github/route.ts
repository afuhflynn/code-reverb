import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify webhook signature (implement signature verification)
    // const isValid = verifySignature(body, signature, webhookSecret);

    if (body.action === "opened" || body.action === "synchronize") {
      const pr = body.pull_request;
      const repo = body.repository;

      // Find the repo in our database
      const dbRepo = await (prisma as any).repo.findUnique({
        where: { githubId: repo.id.toString() },
      });

      if (!dbRepo) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 },
        );
      }

      // Create or update PR
      const dbPR = await (prisma as any).pr.upsert({
        where: { githubId: pr.id.toString() },
        update: {
          title: pr.title,
          description: pr.body,
          status: "open",
        },
        create: {
          number: pr.number,
          title: pr.title,
          description: pr.body,
          githubId: pr.id.toString(),
          repoId: dbRepo.id,
          authorId: dbRepo.ownerId, // Simplified - should map GitHub user to our user
          status: "open",
        },
      });

      // Trigger AI analysis
      await inngest.send({
        name: "pr.analyze",
        data: {
          prId: dbPR.id,
          repoId: dbRepo.id,
          githubPR: pr,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
