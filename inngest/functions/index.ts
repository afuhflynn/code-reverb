import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { Octokit } from "@octokit/rest";

// PR Analysis Worker
export const prAnalyze = inngest.createFunction(
  { id: "pr-analyze" },
  { event: "pr.analyze" },
  async ({ event, step }) => {
    const { prId, repoId, githubPR } = event.data;

    // Get PR and repo details
    const pr = await step.run("get-pr", async () => {
      return await (prisma as any).pr.findUnique({
        where: { id: prId },
        include: { repo: true, author: true },
      });
    });

    if (!pr) {
      throw new Error(`PR ${prId} not found`);
    }

    // Get persona (default to first one or create default)
    const persona = await step.run("get-persona", async () => {
      const defaultPersona = await (prisma as any).persona.findFirst({
        where: { userId: pr.repo.ownerId },
      });

      if (!defaultPersona) {
        // Create default persona
        return await (prisma as any).persona.create({
          data: {
            name: "Balanced Reviewer",
            description:
              "A balanced code reviewer that provides constructive feedback",
            prompt:
              "You are a balanced code reviewer. Provide constructive feedback that helps improve code quality while being encouraging.",
            userId: pr.repo.ownerId,
          },
        });
      }

      return defaultPersona;
    });

    // Create run record
    const run = await step.run("create-run", async () => {
      return await (prisma as any).run.create({
        data: {
          prId: pr.id,
          personaId: persona.id,
          status: "running",
        },
      });
    });

    try {
      // Clone and analyze repository
      const analysis = await step.run("analyze-code", async () => {
        // This would clone the repo and analyze the diff
        // For now, return mock analysis
        const mockCode = `
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}
        `;

        return await aiOrchestrator.generateReview({
          code: mockCode,
          language: "javascript",
          persona,
          prTitle: pr.title,
          prDescription: pr.description,
        });
      });

      // Store comments
      await step.run("store-comments", async () => {
        for (const comment of analysis.comments) {
          await (prisma as any).comment.create({
            data: {
              runId: run.id,
              filePath: comment.filePath,
              line: comment.line,
              content: comment.content,
            },
          });
        }
      });

      // Post comments to GitHub
      await step.run("post-github-comments", async () => {
        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN, // Would need to be configured per user
        });

        for (const comment of analysis.comments) {
          try {
            await octokit.pulls.createReviewComment({
              owner: pr.repo.fullName.split("/")[0],
              repo: pr.repo.fullName.split("/")[1],
              pull_number: pr.number,
              body: comment.content,
              path: comment.filePath,
              line: comment.line,
              commit_id: githubPR.head.sha,
            });
          } catch (error) {
            console.warn("Failed to post comment to GitHub:", error);
          }
        }
      });

      // Store review context in vector DB
      await step.run("store-context", async () => {
        await aiOrchestrator.storeReviewContext(
          "mock code content", // Would be actual diff
          "javascript", // Would detect language
          analysis,
          persona.id,
        );
      });

      // Update run status
      await step.run("update-run", async () => {
        await (prisma as any).run.update({
          where: { id: run.id },
          data: { status: "completed" },
        });
      });

      // Send notification
      await step.run("send-notification", async () => {
        // Email notification would be sent here
        console.log(`Review completed for PR ${pr.number}`);
      });

      return { success: true, runId: run.id };
    } catch (error) {
      // Update run status on failure
      await step.run("update-run-failed", async () => {
        await (prisma as any).run.update({
          where: { id: run.id },
          data: { status: "failed" },
        });
      });

      throw error;
    }
  },
);

// Repository Cloning Worker
export const repoClone = inngest.createFunction(
  { id: "repo-clone" },
  { event: "repo.clone" },
  async ({ event, step }) => {
    const { repoId } = event.data;

    const repo = await step.run("get-repo", async () => {
      return await (prisma as any).repo.findUnique({
        where: { id: repoId },
      });
    });

    if (!repo) {
      throw new Error(`Repository ${repoId} not found`);
    }

    // Clone repository logic would go here
    // This is a placeholder for the actual cloning implementation
    await step.run("clone-repo", async () => {
      // Use git clone or similar
      console.log(`Cloning repository: ${repo.fullName}`);
      // Actual cloning logic...
    });

    return { success: true, repoId };
  },
);

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

    // Post comments to GitHub
    await step.run("post-comments", async () => {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN, // Would need user-specific tokens
      });

      for (const comment of comments) {
        try {
          await octokit.pulls.createReviewComment({
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
  },
);
