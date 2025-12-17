import { NextRequest, NextResponse } from "next/server";
import { reviewPullRequest } from "@/lib/ai/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json({ message: "Pong" });
    }

    if (event === "pull_request") {
      const {
        action,
        repository: { full_name: repo },
        number: prNumber,
      } = body;

      const [owner, repoName] = repo?.split("/");

      if (action === "opened" || action === "synchronized") {
        reviewPullRequest(owner, repoName, prNumber)
          .then(() => console.log(`Review completed for: ${repo} #${prNumber}`))
          .catch((error) =>
            console.error(`Review failed for: ${repo} #${prNumber}: `, error)
          );
      }
    }
    return NextResponse.json({ message: "Event processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
