import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { Octokit } from "@octokit/rest";
import { getRepoFileContents } from "@/lib/github-utils";
import { indexCodebase, retrieveContext } from "@/lib/ai/lib/rag";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/lib/github-utils/actions";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

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

// Ai code review Worker

export const generateReview = inngest.createFunction(
  { id: "generate-review", concurrency: 5 },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
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
        return { ...data, token: account.accessToken };
      }
    );

    const context = await step.run("retrieve-context", async () => {
      const query = `${title}\n${description}`;

      return await retrieveContext(query, `${owner}/${repo}`);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

PR Title: ${title}
PR Description: ${description || "No description provided"}

Context from Codebase:
${context.join("\n\n")}

Code Changes:
\`\`\`diff
${diff}
\`\`\`

Please provide:
1. **Walkthrough**: A file-by-file explanation of the changes.
2. **Sequence Diagram**: A Mermaid JS sequence diagram visualizing the flow of the changes (if applicable). Use \`\`\`mermaid ... \`\`\` block. **IMPORTANT**: Ensure the Mermaid syntax is valid. Do not use special characters (like quotes, braces, parentheses) inside Note text or labels as it breaks rendering. Keep the diagram simple.
3. **Summary**: Brief overview.
4. **Strengths**: What's done well.
5. **Issues**: Bugs, security concerns, code smells.
6. **Suggestions**: Specific code improvements.
7. **Poem**: A short, creative poem summarizing the changes at the very end.

Format your response in markdown.`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(token, owner, repo, prNumber, review);
    });

    await step.run("save-review", async () => {
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
          },
        });
      }
    });
    return { success: true };
  }
);
