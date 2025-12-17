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
      const prompt = `You are a senior software engineer conducting a professional code review. Analyze this pull request with technical precision and provide actionable feedback.

# CRITICAL INSTRUCTIONS - ANTI-HALLUCINATION PROTOCOL
(Strict: follow these exactly)

1. **ONLY analyze code visible in the provided diff.**
2. **NEVER invent file paths, function names, or code structures.**
3. **State uncertainty explicitly** — if context is insufficient, mark as INSUFFICIENT CONTEXT.
4. **DO NOT suggest changes for files not shown in the diff.**
5. **Verify line numbers match the actual diff before suggesting changes.** If they don't, label as LOW CONFIDENCE and ask for corrected diffs.
6. **Flag items requiring manual review** when context is incomplete. Use the "Manual review required" tag.
7. **When in doubt, request additional context instead of guessing.**

## Self-Verification Checklist ✅
Before finishing the review, confirm:
- No invented files/functions/lines are referenced.
- All line numbers correspond to the diff.
- All assumptions are labeled with CONFIDENCE level.
If any check fails, mark findings as **INSUFFICIENT CONTEXT** and stop.

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

# Review Output Format (strict)
Use Markdown. Keep each top-level section short and scannable. Use the exact headings below.

## Walkthrough 🔎
Provide a short table summarizing cohorts/files and a one-line summary each.

| Cohort / File(s) | Change Summary |
|---|---|
| **Category Name** | One-line summary of changes |
| \`path/to/file1.ts\` | Short, technical impact statement |
| \`path/to/file2.tsx\` | Short, technical impact statement |

> **Note:** If a file in this table is not present in the diff, remove it and mark the entry as **INSUFFICIENT CONTEXT**.

---

## Changes (per file)
For each changed file produce a section:

### File: \`path/to/file.ext\` ⚙️
**Purpose**: 1–2 lines about file role.

**Modifications**:
- **Line(s)**: e.g. \`12-24\`
- **What changed**: one sentence
- **Why**: brief rationale
- **Impact**: bullet list of immediate risks/consumers

**Technical Details**:
<details>
<summary>Expand for deep analysis</summary>

- Design patterns used
- Potential side effects
- Dependencies affected
- Edge cases and boundary conditions
- Performance characteristics

</details>

**Confidence**: **HIGH / MEDIUM / LOW / INSUFFICIENT CONTEXT**  — choose one and justify with 1 short sentence.

---

## Critical Issues (sorted by severity)
Use short badges and emojis only for clarity. Keep each issue compact.

### 🔥 SEVERITY: HIGH | CONFIDENCE: HIGH
**Location**: \`path/to/file:line-start-line-end\`
**Issue**: One-line title.
**Evidence**: paste the *exact* snippet from the diff (do not paraphrase).
**Analysis**: 2–3 short bullets.
**Recommended Fix**: code diff (if trivial) and a 1-line rationale.
**AI Auto-Fix Prompt**: *Only include this if CONFIDENCE is HIGH and the fix is unambiguous.*

---

### ⚠️ SEVERITY: MEDIUM | CONFIDENCE: MEDIUM
(Structure same as above — be conservative with automated fixes)

---

### ℹ️ SEVERITY: LOW | CONFIDENCE: LOW
(Quick suggestions or stylistic notes)

---

## Suggestions (quality, security, testing)
Group suggestions by theme. For each suggestion:
- **Confidence**: HIGH/MEDIUM/LOW
- **Action**: copy-pastable code or checklist
- **Why**: one sentence benefit

---

## Estimated Code Review Effort 🕒
**Complexity**: [Simple / Moderate / Complex]
**Estimated Time**: 🕒 **~X minutes**
**Justification**:
- Reason 1 (lines changed, #files)
- Reason 2 (new modules / public APIs)
- Reason 3 (tests required / integration risk)

Use the time emoji (🕒) and one extra emoji max to highlight the complexity. Do not use emojis in code or file paths.

---

## Architecture & Flow Analysis 🧭
**Only produce this if the diff contains cross-layer interactions (API → Service → DB).** If not, write: **INSUFFICIENT CONTEXT to generate architecture diagrams.**

If generated, include a small mermaid diagram and a 2–3 sentence flow description.

---

## Tests & Coverage 🧪
- Tests added/modified? yes/no
- Suggested unit/integration tests (short bullets)
- Confidence

---

## Pre-merge Checklist ✅
- [ ] Resolve HIGH severity issues
- [ ] Add unit tests for modified logic
- [ ] Verify type safety for nullable properties
- [ ] Run full test suite (CI green)

Mark items that cannot be verified as **INSUFFICIENT CONTEXT**.

---

## Related PRs / Cross-References 📌
List only PRs explicitly mentioned in the diff or PR description. Do not invent.

---

## Review Confidence Summary
- **High Confidence**: list 1–3 items
- **Medium Confidence**: list 1–3 items
- **Insufficient Context**: list items needing manual review

---
## Poem:

Generate a short, relevant poem about the **specific changes in this pull request**.

STRICT RULES:
- The poem MUST reference only modifications visible in the provided diff.
- DO NOT write a generic poem. If the changes are small, keep the poem minimal.
- DO NOT invent features, files, or behavior not shown in the diff.
- The poem MUST be rendered inside a Markdown blockquote.
- EVERY line of the poem MUST start with a ">" character.
- DO NOT include any text outside the blockquote.
- If no meaningful changes are present, generate a short reflective poem acknowledging minimal change.

FORMAT (mandatory):

> Line one of the poem
> Line two of the poem
> Line three of the poem

---

**End of Review**
*This review followed the Anti-Hallucination Protocol: only visible code reviewed; assumptions flagged; manual review items called out.*`;

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
