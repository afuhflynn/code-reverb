import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { getRepoFileContents } from "@/lib/github-utils";
import { indexCodebase, retrieveContext } from "@/lib/ai/lib/rag";
import {
  getPullRequestDiff,
  postReviewComment,
  postSummaryAsUser,
} from "@/lib/github-utils/actions";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getOctokitForInstallation } from "@/config/octokit-instance";

// Comment Posting Worker
export const commentPost = inngest.createFunction(
  { id: "comment-post" },
  { event: "comment.post" },
  async ({ event, step }) => {
    const { runId } = event.data;

    const run = await step.run("get-run", async () => {
      return await (prisma as any).run.findUnique({
        where: { id: runId },
        include: { pr: { include: { repo: true } } },
      });
    });

    if (!run) {
      throw new Error(`Run ${runId} not found`);
    }

    const comments = await step.run("get-comments", async () => {
      return await (prisma as any).comment.findMany({
        where: { runId },
      });
    });

    const installationId = await step.run("get-installation-id", async () => {
      return await (prisma as any).installation.findFirst({
        where: {
          userId: run.userId,
        },
        select: {
          installationId: true,
        },
      });
    });

    // Post comments to GitHub
    await step.run("post-comments", async () => {
      const octokit = getOctokitForInstallation(installationId);

      for (const comment of comments) {
        try {
          await octokit.rest.pulls.createReviewComment({
            owner: run.pr.repo.fullName.split("/")[0],
            repo: run.pr.repo.fullName.split("/")[1],
            pull_number: run.pr.number,
            body: comment.content,
            path: comment.filePath,
            line: comment.line,
            commit_id: run.pr.githubId, // Would need to store commit SHA
          });
        } catch (error) {
          console.warn("Failed to post comment:", error);
        }
      }
    });

    return { success: true, commentCount: comments.length };
  }
);

// Repo indexing Worker (Embed to pinecone)
export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
  },
  {
    event: "repository.connected",
  },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // Fetch all files in repo
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken)
        throw new Error("No GitHub access token found");

      return await getRepoFileContents(account.accessToken, owner, repo);
    });

    // Index codebase
    await step.run("index-codebase", async () => {
      await indexCodebase(`${owner}/${repo}`, files);
    });

    return { success: true, indexedFiles: files.length };
  }
);

// Handle app installation
export const handleAppInstallation = inngest.createFunction(
  {
    id: "app-installation-created",
  },
  {
    event: "installation.created",
  },
  async ({ event, step }) => {
    const { installationId, accountId, login, userId } = event.data;
    const { account } = await step.run("verify-user-identity", async () => {
      const account = await prisma.account.findFirst({
        where: {
          accountId: String(accountId),
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        throw new Error("Invalid account");
      }
      return { success: true, account };
    });

    await step.run("save-app-installation-user-info", async () => {
      const installation = await prisma.installation.upsert({
        where: {
          userId: account.user.id,
        },
        create: {
          accountId: account.id,
          userId: account.user.id,
          installationId,
          githubAccountId: accountId,
          githubUserId: userId,
        },
        update: {
          installationId,
          githubAccountId: accountId,
          githubUserId: userId,
        },
      });

      if (!installation) {
        throw new Error("Failed to save app installation data");
      }

      await prisma.user.update({
        where: { id: account.user.id },
        data: { username: login, hasCompletedOnboarding: true },
      });

      return { success: true };
    });

    return { success: true };
  }
);

// Handle app deletion
export const handleAppDeletion = inngest.createFunction(
  {
    id: "app-installation-deleted",
  },
  { event: "installation.deleted" },
  async ({ event, step }) => {
    const { installationId, accountId, userId } = event.data;
    const { account } = await step.run("verify-user-identity", async () => {
      const account = await prisma.account.findFirst({
        where: {
          accountId: String(accountId),
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        throw new Error("Invalid account");
      }
      return { success: true, account };
    });

    await step.run("delete-installation", async () => {
      const installation = await prisma.installation.delete({
        where: {
          githubAccountId: accountId,
          githubUserId: userId,
          installationId,
        },
      });

      if (!installation) throw new Error("Installation not found");
      await prisma.user.update({
        where: { id: account.user.id },
        data: { hasCompletedOnboarding: false },
      });
      return { success: true };
    });

    return { sucess: true };
  }
);

// Handle app suspend
export const handleInstallationSuspended = inngest.createFunction(
  {
    id: "app-installation-suspended",
  },
  {
    event: "installation.suspend",
  },
  async ({ event, step }) => {
    const { installationId, accountId } = event.data;
    const { account } = await step.run("verify-user-identity", async () => {
      const account = await prisma.account.findFirst({
        where: {
          accountId: String(accountId),
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        throw new Error("Invalid account");
      }
      return { success: true, account };
    });

    await step.run("mark-installation-suspended", async () => {
      const [updatedInstallation, updatedUser] = await prisma.$transaction([
        prisma.installation.update({
          where: {
            installationId,
          },
          data: {
            isActive: false,
          },
        }),
        prisma.user.update({
          where: { id: account.user.id },
          data: { hasCompletedOnboarding: false },
        }),
      ]);

      if (!updatedInstallation || !updatedUser) {
        throw new Error("Failed to suspend installation");
      }

      return { success: true };
    });

    return { success: true };
  }
);

// Handle app unsuspend
export const handleInstallationUnsuspended = inngest.createFunction(
  {
    id: "app-installation-unsuspended",
  },
  {
    event: "installation.unsuspend",
  },
  async ({ event, step }) => {
    const { installationId, accountId } = event.data;
    const { account } = await step.run("verify-user-identity", async () => {
      const account = await prisma.account.findFirst({
        where: {
          accountId: String(accountId),
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        throw new Error("Invalid account");
      }
      return { success: true, account };
    });

    await step.run("mark-installation-active", async () => {
      const [updatedInstallation, updatedUser] = await prisma.$transaction([
        prisma.installation.update({
          where: {
            installationId,
          },
          data: {
            isActive: true,
          },
        }),
        prisma.user.update({
          where: { id: account.user.id },
          data: { hasCompletedOnboarding: true },
        }),
      ]);

      if (!updatedInstallation || !updatedUser) {
        throw new Error("Failed to suspend installation");
      }

      return { success: true };
    });

    return { success: true };
  }
);

// AI PR Summary Worker
export const summarizePr = inngest.createFunction(
  { id: "summarize-pr", concurrency: 20 },
  { event: "pr.summary.requested" },

  async ({ event, step }) => {
    const {
      owner,
      repo,
      prNumber,
      title,
      description,
      accountId,
      changedFiles,
      additions,
      deletions,
      installationId,
    } = event.data;

    // No summary for too many files changed
    if (changedFiles > 50) {
      throw new Error("Too many files changed");
    }

    const { diff } = await step.run("fetch-pr-diff", async () => {
      const account = await prisma.account.findFirst({
        where: {
          accountId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) {
        throw new Error("No GitHub access token found");
      }

      const data = await getPullRequestDiff(
        account.accessToken,
        owner,
        repo,
        prNumber
      );
      return { ...data };
    });

    const summary = await step.run("generate-pr-summary", async () => {
      const prompt = `You are a senior engineer reviewing pull requests. Analyze the code diff and write a concise summary for teammates scanning notifications.

Rules:
- 2–4 bullet points maximum
- Focus on WHAT changed and WHY (infer from code context)
- Use the diff as your primary source of truth
- If PR description exists, use it for additional context
- Be specific about files, functions, or logic that changed
- No generic statements like "updates functions" - explain what actually changed

Output format: Plain bullet points, no markdown formatting.`;

      const userPrompt = `PR Title: ${title}

PR Description: ${description || "No description provided"}

Stats:
- Files changed: ${changedFiles}
- Additions: +${additions}
- Deletions: -${deletions}

Code Diff:
${diff}

Generate a technical summary based primarily on the code changes above.`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: prompt,
        prompt: userPrompt,
      });

      return text;
    });

    await step.run("post-summary-comment", async () => {
      await postSummaryAsUser(owner, repo, prNumber, summary);
    });

    return { success: true };
  }
);

// Ai code review Worker
export const generateReview = inngest.createFunction(
  { id: "generate-review", concurrency: 5 },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId, runId, installationId } = event.data;

    // Update run status to running
    await step.run("update-run-status", async () => {
      await (prisma as any).run.update({
        where: { id: runId },
        data: { status: "running" },
      });
    });

    const { diff, title, description } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No GitHub access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repo,
          prNumber
        );
        return { ...data };
      }
    );

    const context = await step.run("retrieve-context", async () => {
      const query = `${title}\n${description}`;

      return await retrieveContext(query, `${owner}/${repo}`);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are a senior software engineer conducting a professional code review for this specific repository. Analyze this pull request with technical precision and provide concise, actionable feedback.

# CRITICAL INSTRUCTIONS – ANTI-HALLUCINATION PROTOCOL (MUST FOLLOW)

1. ONLY analyze code visible in the provided diff.
2. NEVER invent file paths, function names, modules, or behavior.
3. If context is missing, explicitly write **INSUFFICIENT CONTEXT** and avoid guessing.
4. Do NOT suggest changes for files not shown in the diff.
5. If you are unsure about line numbers or impact, mark the item as **LOW CONFIDENCE** and say why.
6. Prefer fewer, high-quality findings over many speculative ones.

Before you finish, mentally check:
- No invented files/functions/lines are referenced.
- All assumptions are clearly labeled with a confidence level.
If any of these fail, downgrade confidence and/or mark as **INSUFFICIENT CONTEXT**.

---

# Pull Request Information
**Title**: ${title}
**Description**: ${description || "No description provided"}

## Codebase Context
${context.join("\n\n")}

## Code Changes (visible diff)
\`\`\`diff
${diff}
\`\`\`

---

# Review Output Format (STRICT)
Use Markdown. Be concise. For small/simple PRs, keep sections brief.

## Summary
- 1–3 short bullets summarizing the overall change.
- Mention risk level (low/medium/high) and main affected area(s).

---

## Changes (per file)
Create **one section per changed file** using this exact heading format so it can be parsed:

### File: \`path/to/file.ext\`

For each file:
- **Purpose**: 1–2 lines describing this file's role (or **INSUFFICIENT CONTEXT**).
- **Key modifications** (bullet list, max 3 bullets):
  - Line(s): \`start-end\` — what changed and why it likely changed.
- **Impact**: bullet list of immediate risks/consumers (or "Minimal impact" if trivial).
- **Confidence**: **HIGH / MEDIUM / LOW / INSUFFICIENT CONTEXT** — 1 short justification.

If you have no meaningful feedback for a file, still create the section and say "No issues found in this diff (Confidence: HIGH)".

---

## Critical Issues (sorted by severity)
Only include issues that materially affect correctness, security, performance, or maintainability.

For each issue:
- **Severity**: HIGH / MEDIUM / LOW
- **Confidence**: HIGH / MEDIUM / LOW / INSUFFICIENT CONTEXT
- **Location**: \`path/to/file:line-start-line-end\`
- **Issue**: one-line title.
- **Evidence**: paste the exact snippet from the diff (do not paraphrase).
- **Analysis**: 1–3 short bullets.
- **Suggested fix**: short description or minimal code snippet.

Keep this section empty if there are no real issues; do NOT invent nitpicks just to fill it.

---

## Suggestions (quality, security, testing)
Group high-value suggestions only. For each suggestion:
- **Type**: quality / security / testing / style
- **Confidence**: HIGH / MEDIUM / LOW
- **Action**: concrete, copy-pastable code or a very short checklist.
- **Why**: one short sentence describing the benefit.

Avoid generic style advice unless the diff clearly violates existing patterns.

---

## Tests & Verification
- **Tests added/modified?** yes/no (based on the diff only).
- **Recommended tests**: 2–5 bullets with specific scenarios or functions to cover.
- **Confidence**: HIGH / MEDIUM / LOW.

---

## Pre-merge Checklist
Use this checklist, marking items that cannot be verified as **INSUFFICIENT CONTEXT**:
- [ ] All HIGH severity issues addressed or explicitly accepted.
- [ ] Appropriate unit tests exist or are added for changed logic.
- [ ] Risky paths (auth, payments, persistence, concurrency) manually reviewed.
- [ ] CI/test suite passes.

---

## Review Confidence Summary
- **High confidence**: 1–3 key points you are very sure about.
- **Medium/low confidence**: 1–3 items that depend on missing context.
- **Items requiring manual review**: list anything that a human must double-check.

---

**End of Review**
*This review followed the Anti-Hallucination Protocol: only visible diff analyzed; assumptions labeled; speculative items minimized.*`;
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(installationId, owner, repo, prNumber, review);
    });

    await step.run("save-review-result", async () => {
      const startTime = Date.now();

      // Save review result to Run
      await (prisma as any).run.update({
        where: { id: runId },
        data: {
          result: review,
          status: "completed",
          processingTime: Date.now() - startTime,
        },
      });

      // Parse review text to extract comments (simplified: create one comment per file section)
      const fileSections = review.split(/### File: `([^`]+)`/);
      for (let i = 1; i < fileSections.length; i += 2) {
        const filePath = fileSections[i];
        const content = fileSections[i + 1]
          ?.split(/### File: |## [^#]/)?.[0]
          ?.trim();

        if (content) {
          await (prisma as any).comment.create({
            data: {
              runId,
              filePath,
              content,
            },
          });
        }
      }

      // If no file sections found, save full review as one comment
      if (fileSections.length <= 1) {
        await (prisma as any).comment.create({
          data: {
            runId,
            filePath: null,
            content: review,
          },
        });
      }

      // Keep old Review model for backward compatibility
      const repository = await prisma.repo.findFirst({
        where: {
          ownerId: userId,
          fullName: `${owner}/${repo}`,
          name: repo,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: title,
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review,
            status: "completed",
            userId,
          },
        });
      }
    });
    return { success: true };
  }
);
