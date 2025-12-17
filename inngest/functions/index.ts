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

## Evidence-Based Review Requirements
1. **ONLY analyze code visible in the provided diff**
2. **NEVER invent file paths, function names, or code structures**
3. **State uncertainty explicitly** - if context is insufficient, say so
4. **DO NOT suggest changes for files not shown in the diff**
5. **Verify line numbers match the actual diff before suggesting changes**
6. **Flag items requiring manual review** when context is incomplete
7. **When in doubt, request additional context instead of guessing**

## Confidence Indicators
Mark each suggestion with a confidence level:
- **HIGH CONFIDENCE**: Clear issue with visible evidence and obvious fix
- **MEDIUM CONFIDENCE**: Likely issue but may need additional verification
- **LOW CONFIDENCE**: Potential concern requiring manual inspection
- **INSUFFICIENT CONTEXT**: Cannot review without additional information

---

# Pull Request Information

**Title**: ${title}
**Description**: ${description || "No description provided"}

## Codebase Context
${context.join("\n\n")}

## Code Changes
\`\`\`diff
${diff}
\`\`\`

---

# Review Output Format

## Walkthrough

Provide a structured overview of all changes using this table format:

| Cohort / File(s) | Change Summary |
|------------------|----------------|
| **Category Name** | Concise description of changes in this category |
| \`path/to/file1.ts\` | Detailed explanation of modifications, their purpose, and impact on the system |
| \`path/to/file2.tsx\` | Technical description of changes including architecture implications |

**Example:**
| Cohort / File(s) | Change Summary |
|------------------|----------------|
| **Authentication** | New client-side authentication UI pages for sign-in and sign-up with form components |
| \`app/(auth)/signin/page.tsx\`, \`app/(auth)/signup/page.tsx\` | Added SignInPage and SignUpPage components with centered Card layout containing email/password form fields and authentication buttons. Both pages use "use client" directive for client-side rendering |
| **Code Review System** | Enhanced AI review prompt with anti-hallucination guidelines and comprehensive review structure |
| \`ingest/functions/index.ts\` | Expanded generateReview function with confidence level instructions and detailed review framework. Function signature remains unchanged |

---

## Changes

For each file or logical group of changes, provide:

### File: \`path/to/file.ext\`

**Purpose**: Brief technical description of this file's role in the system.

**Modifications**:
- List key changes with line references
- Explain technical rationale
- Note architectural implications
- Identify integration points

**Technical Details**:
<details>
<summary>Detailed Analysis</summary>

- Design patterns employed
- Potential side effects
- Dependencies affected
- Edge cases and boundary conditions
- Performance characteristics

</details>

---

## Estimated Code Review Effort

**Complexity**: [Simple/Moderate/Complex] | **Estimated Time**: ~X minutes

**Justification**:
- Point 1: Rationale for complexity assessment
- Point 2: Key factors affecting review time
- Point 3: Areas requiring deeper analysis

---

## Architecture & Flow Analysis

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    participant Database

    Client->>API: HTTP Request
    API->>Service: Process Request
    Service->>Database: Query Data
    Database-->>Service: Return Results
    Service-->>API: Formatted Response
    API-->>Client: JSON Response
\`\`\`

**Flow Description**: Technical explanation of data and control flow through the system with these changes.

### System Impact
- **Coupling**: Analysis of module dependencies and inter-component relationships
- **Scalability**: Performance implications under load and growth scenarios
- **Maintainability**: Long-term maintenance considerations and technical debt

---

## Critical Issues

Issues requiring immediate attention before merge:

### SEVERITY: HIGH | CONFIDENCE: HIGH

<details>
<summary><strong>[Security] Remote Code Execution Vulnerability</strong></summary>

**Location**: \`src/utils/calculator.ts:42-45\`

**Issue**:
\`\`\`typescript
// Current implementation
function unsafeOperation(userInput: string) {
  return eval(userInput);
}
\`\`\`

**Technical Analysis**: Direct use of \`eval()\` with user input creates a critical remote code execution vulnerability. Attackers can inject arbitrary JavaScript code, compromising application security and user data.

**Recommended Fix**:
\`\`\`diff
- function unsafeOperation(userInput: string) {
-   return eval(userInput);
- }
+ function safeOperation(userInput: string) {
+   const allowedOperations = {
+     add: (a: number, b: number) => a + b,
+     subtract: (a: number, b: number) => a - b,
+     multiply: (a: number, b: number) => a * b,
+     divide: (a: number, b: number) => a / b,
+   };
+
+   const parsed = parseOperation(userInput);
+   if (!(parsed.op in allowedOperations)) {
+     throw new Error('Invalid operation');
+   }
+   return allowedOperations[parsed.op](parsed.a, parsed.b);
+ }
\`\`\`

**Impact**: Eliminates RCE vector, implements operation allowlist, maintains type safety.

**AI Auto-Fix Prompt**:
<details>
<summary>Copy prompt for automated fix</summary>

\`\`\`
Replace the eval() function in src/utils/calculator.ts with a safe alternative:
1. Create an allowlist of permitted operations (add, subtract, multiply, divide)
2. Implement input parsing and validation
3. Use function lookup table instead of eval
4. Throw errors for invalid operations
5. Maintain identical function signature and return type
6. Preserve existing test compatibility
7. Add input sanitization for operation strings
\`\`\`
</details>

**References**: OWASP Code Injection Prevention, CWE-95

</details>

---

### SEVERITY: MEDIUM | CONFIDENCE: HIGH

<details>
<summary><strong>[Performance] Nested Loop Causing O(n²) Complexity</strong></summary>

**Location**: \`src/components/List.tsx:89-94\`

**Issue**:
\`\`\`typescript
// Current implementation
items.forEach(item => {
  const related = items.filter(i => i.categoryId === item.categoryId);
  processRelated(item, related);
});
\`\`\`

**Technical Analysis**: Nested iteration over the same array results in O(n²) time complexity. For large datasets (n > 1000), this causes significant performance degradation.

**Performance Metrics**:
- Current: O(n²) - 1,000 items = 1,000,000 operations
- Optimized: O(n) - 1,000 items = 1,000 operations
- Improvement: 1000x reduction in operations

**Recommended Fix**:
\`\`\`diff
+ const groupedByCategory = items.reduce((acc, item) => {
+   const key = item.categoryId;
+   if (!acc.has(key)) {
+     acc.set(key, []);
+   }
+   acc.get(key).push(item);
+   return acc;
+ }, new Map<string, Item[]>());
+
  items.forEach(item => {
-   const related = items.filter(i => i.categoryId === item.categoryId);
+   const related = groupedByCategory.get(item.categoryId) || [];
    processRelated(item, related);
  });
\`\`\`

**AI Auto-Fix Prompt**:
<details>
<summary>Copy prompt for automated fix</summary>

\`\`\`
Optimize the nested loop in src/components/List.tsx:89-94:
1. Pre-group items by categoryId using Map.reduce()
2. Replace filter operation with Map lookup
3. Maintain exact functional behavior
4. Preserve type safety with proper TypeScript generics
5. Add explanatory comment about the optimization
6. Ensure all existing tests pass
7. Handle edge cases (empty arrays, missing categoryId)
\`\`\`
</details>

</details>

---

### SEVERITY: MEDIUM | CONFIDENCE: MEDIUM

<details>
<summary><strong>[Type Safety] Potential Null Reference</strong></summary>

**Location**: \`src/api/users.ts:45\`

**Observation**: Code accesses nested properties without null checks:
\`\`\`typescript
const avatar = user.profile.avatar;
\`\`\`

**Analysis Limitation**: Cannot verify if \`profile\` and \`avatar\` are optional without access to the User type definition.

**Recommended Action**: Manual verification required. If properties are optional, implement null safety:

\`\`\`typescript
const avatar = user.profile?.avatar ?? DEFAULT_AVATAR;
\`\`\`

**Status**: INSUFFICIENT CONTEXT - Type definitions not visible in diff

</details>

---

## Suggestions

### Code Quality Enhancements

<details>
<summary><strong>[Enhancement] Input Validation with Schema</strong> | CONFIDENCE: HIGH</summary>

**Location**: \`src/api/users.ts:23-28\`

**Current State**: Direct use of unvalidated input data.

**Recommended Implementation**:
\`\`\`diff
+ import { z } from 'zod';
+
+ const UserCreateSchema = z.object({
+   email: z.string().email('Invalid email format'),
+   age: z.number().int().min(13).max(120),
+   username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
+ });
+
  export async function createUser(data: unknown) {
+   const validated = UserCreateSchema.parse(data);
-   return await db.users.create(data);
+   return await db.users.create(validated);
  }
\`\`\`

**Benefits**:
- Runtime type safety
- Detailed validation error messages
- Self-documenting API contract
- Prevention of invalid data persistence

**AI Auto-Fix Prompt**:
<details>
<summary>Copy prompt for automated fix</summary>

\`\`\`
Add Zod schema validation to createUser in src/api/users.ts:
1. Import Zod library
2. Define UserCreateSchema with email, age, username validation
3. Parse incoming data before database operations
4. Handle validation errors with descriptive messages
5. Maintain backward compatibility
6. Add JSDoc comments documenting validation rules
7. Ensure TypeScript types are inferred from schema
\`\`\`
</details>

</details>

---

### Security Enhancements

<details>
<summary><strong>[Security] Rate Limiting for Authentication Endpoint</strong> | CONFIDENCE: MEDIUM</summary>

**Location**: \`src/api/auth/login.ts:12\`

**Current State**: No rate limiting detected on authentication endpoint.

**Recommended Implementation**:
\`\`\`diff
+ import rateLimit from 'express-rate-limit';
+
+ const loginLimiter = rateLimit({
+   windowMs: 15 * 60 * 1000,
+   max: 5,
+   message: 'Too many login attempts, please try again later',
+   standardHeaders: true,
+   legacyHeaders: false,
+ });
+
- app.post('/api/auth/login', async (req, res) => {
+ app.post('/api/auth/login', loginLimiter, async (req, res) => {
    // ... authentication logic
  });
\`\`\`

**Security Impact**: Mitigates brute force attacks and credential stuffing attempts.

**AI Auto-Fix Prompt**:
<details>
<summary>Copy prompt for automated fix</summary>

\`\`\`
Implement rate limiting for the login endpoint in src/api/auth/login.ts:
1. Install and import express-rate-limit
2. Configure limiter: 5 attempts per 15-minute window
3. Apply middleware to login route
4. Return 429 status when limit exceeded
5. Implement progressive delays for repeated failures
6. Add logging for security monitoring
7. Preserve existing authentication logic
\`\`\`
</details>

</details>

---

### Testing Recommendations

<details>
<summary><strong>[Testing] Edge Case Coverage</strong> | CONFIDENCE: HIGH</summary>

**Location**: Test coverage needed for \`src/utils/validator.ts\`

**Recommended Test Suite**:
\`\`\`diff
+ import { describe, it, expect } from 'vitest';
+ import { validateUserInput } from './validator';
+
+ describe('validateUserInput', () => {
+   it('should reject null values', () => {
+     expect(() => validateUserInput(null)).toThrow('Invalid input');
+   });
+
+   it('should reject undefined values', () => {
+     expect(() => validateUserInput(undefined)).toThrow('Invalid input');
+   });
+
+   it('should sanitize XSS attempts', () => {
+     const malicious = '<script>alert("xss")</script>';
+     const result = validateUserInput(malicious);
+     expect(result).not.toContain('<script>');
+   });
+
+   it('should handle SQL injection patterns', () => {
+     const malicious = "'; DROP TABLE users; --";
+     const result = validateUserInput(malicious);
+     expect(result).not.toContain('DROP TABLE');
+   });
+ });
\`\`\`

**AI Auto-Fix Prompt**:
<details>
<summary>Copy prompt for automated fix</summary>

\`\`\`
Create comprehensive unit tests for src/utils/validator.ts:
1. Test null and undefined inputs
2. Test XSS attack patterns
3. Test SQL injection patterns
4. Test boundary conditions
5. Test valid input preservation
6. Ensure test isolation
7. Target 100% code coverage
8. Use existing test framework (Jest/Vitest)
\`\`\`
</details>

</details>

---

## Pre-merge Checklist

**Critical Items**:
- [ ] Resolve all HIGH severity issues
- [ ] Add unit tests for modified code
- [ ] Verify type safety for nullable properties
- [ ] Run full test suite

**Recommended Items**:
- [ ] Address MEDIUM severity issues
- [ ] Add JSDoc documentation for public APIs
- [ ] Apply consistent code style
- [ ] Update relevant documentation

**Verification Required**:
- [ ] Manual review of items marked INSUFFICIENT CONTEXT
- [ ] Performance testing with production-scale data
- [ ] Security audit of authentication flows
- [ ] Integration testing with dependent services

---

## Possibly Related PRs

Review these PRs for potential conflicts or dependencies:
- Related PR #123: Modifies the same authentication surface in \`app/(auth)/signup/page.tsx\`
- Related PR #456: Database schema changes affecting user table

---

## Review Confidence Summary

**High Confidence Reviews**: Security vulnerabilities, performance issues in visible code, code style improvements

**Medium Confidence Reviews**: Suggestions requiring additional context, patterns that may be intentional

**Insufficient Context**: Database migrations, type definitions not in diff, integration requirements, breaking change assessment

**Anti-Hallucination Protocol**: Active
- Only reviewed code present in provided diff
- Flagged all assumptions explicitly
- Stated limitations clearly
- Requested additional context where needed

---

## Poem

Sign in, sign up with UI so clean,
Forms dancing where none have been seen,
Reviews now wiser with guidelines anew,
Pinecone queries optimized—RAG runs true!

---

## Pre-merge Checks and Finishing Touches

**Failed Checks**: 1 warning
- Security: eval() usage detected in calculator.ts

**Passed Checks**: 2 passed
- Linting: No style violations
- Build: Compilation successful

**Finishing Touches**:
- Add CHANGELOG entry for breaking changes
- Update API documentation
- Verify backward compatibility

---

**End of Review**

*This review was conducted with anti-hallucination safeguards. All suggestions are based solely on visible code changes and provided context. Manual verification recommended for items marked INSUFFICIENT CONTEXT.*
`;

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
