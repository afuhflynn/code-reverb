import { NextRequest, NextResponse } from "next/server";
import { reviewPullRequest } from "@/lib/ai/actions";
import { inngest } from "@/lib/inngest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");

    console.log({ body });

    if (event === "ping") {
      return NextResponse.json({ message: "Pong" });
    }

    if (event === "pull_request") {
      const {
        action,
        repository: { full_name: repo },
        number: prNumber,
        pull_request,
      } = body;

      const [owner, repoName] = repo?.split("/");

      if (action === "opened" || action === "synchronized") {
        // await inngest.send({
        //   name: "pr.summary.requested",
        //   data: {
        //     owner,
        //     repo,
        //     prNumber,
        //     title: pull_request?.title ?? "",
        //     description: pull_request?.body ?? "",
        //     userId: owner,
        //     installationId: payload.installation?.id ?? null,
        //   },
        // });
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
