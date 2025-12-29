import { NextRequest, NextResponse } from "next/server";
import {
  generatePullRequestSummary,
  reviewPullRequest,
} from "@/lib/ai/actions";
import { inngest } from "@/lib/inngest";

import { Webhooks } from "@octokit/webhooks";

const webhooks = new Webhooks({
  secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
});

/**
 * Webhook handler for GitHub events
 * Processes installation lifecycle events and pull request triggers
 */
export async function POST(request: NextRequest) {
  try {
    // Read body as text first (you can only read it once)
    const bodyText = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");

    // Verify webhook signature
    if (!signature || !(await webhooks.verify(bodyText, signature))) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse JSON after verification
    const body = JSON.parse(bodyText);

    // Health check response
    if (event === "ping") {
      return NextResponse.json({ message: "Pong" });
    }

    // Handle GitHub App installation events
    if (event === "installation") {
      // Handle GitHub App installation created
      if (body?.action === "created" && body?.installation) {
        inngest.send({
          name: "installation.created",
          data: {
            installationId: body.installation?.id ?? null,
            accountId: body.installation?.account?.id ?? null,
            userId: body?.sender?.id ?? null,
            login: body?.sender?.login ?? null,
          },
        });
        return NextResponse.json({ message: "Installation created" });
      }

      // Handle GitHub App installation deleted
      if (body?.action === "deleted" && body?.installation) {
        inngest.send({
          name: "installation.deleted",
          data: {
            installationId: body.installation?.id ?? null,
            accountId: body.installation?.account?.id ?? null,
            userId: body?.sender?.id ?? null,
            login: body?.sender?.login ?? null,
          },
        });
        return NextResponse.json({ message: "Installation deleted" });
      }

      // Handle GitHub App installation suspended
      if (body?.action === "suspend" && body?.installation) {
        inngest.send({
          name: "installation.suspend",
          data: {
            installationId: body.installation?.id ?? null,
            accountId: body.installation?.account?.id ?? null,
            userId: body?.sender?.id ?? null,
            login: body?.sender?.login ?? null,
          },
        });
        return NextResponse.json({ message: "Installation suspended" });
      }

      // Handle GitHub App installation unsuspended
      if (body?.action === "unsuspend" && body?.installation) {
        inngest.send({
          name: "installation.unsuspend",
          data: {
            installationId: body.installation?.id ?? null,
            accountId: body.installation?.account?.id ?? null,
            userId: body?.sender?.id ?? null,
            login: body?.sender?.login ?? null,
          },
        });
        return NextResponse.json({ message: "Installation unsuspended" });
      }
    }

    // Handle pull request events
    if (event === "pull_request") {
      const {
        action,
        repository: { full_name: repo },
        number: prNumber,
        pull_request,
      } = body;

      const [owner, repoName] = repo?.split("/");
      // trigger pr summary immediately after
      if (action === "opened") {
        await generatePullRequestSummary(
          owner,
          repo,
          prNumber,
          pull_request?.title,
          pull_request?.body,
          body?.installation?.id,
          pull_request?.base?.sha,
          pull_request?.head?.sha,
          pull_request?.changed_files,
          pull_request?.additions,
          pull_request?.deletions
        )
          .then(() =>
            console.log(`Summary completed for: ${repo} #${prNumber}`)
          )
          .catch((error) =>
            console.error(
              `Summarization failed for repo: ${repo} #${prNumber}: `,
              error
            )
          );
      }
      // Trigger AI review when PR is opened or updated
      if (action === "opened" || action === "synchronized") {
        await reviewPullRequest(owner, repoName, prNumber)
          .then(() => console.log(`Review completed for: ${repo} #${prNumber}`))
          .catch((error) =>
            console.error(
              `Review failed for repo: ${repo} #${prNumber}: `,
              error
            )
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
