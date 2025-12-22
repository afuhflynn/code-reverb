import { NextRequest, NextResponse } from "next/server";
import { reviewPullRequest } from "@/lib/ai/actions";
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

      // Trigger AI review when PR is opened or updated
      if (action === "opened" || action === "synchronized") {
        // IMPROVED: Send event with flag to fetch diff for better summary
        await inngest.send({
          name: "pr.summary.requested",
          data: {
            owner,
            repo: repoName,
            prNumber,
            title: pull_request?.title ?? "",
            description: pull_request?.body ?? "",
            userId: owner,
            installationId: body?.installation?.id ?? null,
            baseSha: pull_request?.base?.sha,
            headSha: pull_request?.head?.sha,
            changedFiles: pull_request?.changed_files ?? 0,
            additions: pull_request?.additions ?? 0,
            deletions: pull_request?.deletions ?? 0,
          },
        });
        reviewPullRequest(owner, repoName, prNumber)
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
