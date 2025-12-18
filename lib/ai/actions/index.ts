"use server";

import { getPullRequestDiff } from "@/lib/github-utils/actions";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number,
) {
  try {
    const repository = await prisma.repo.findFirst({
      where: {
        name: repo,
        fullName: `${owner}/${repo}`,
      },
      include: {
        owner: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository)
      throw new Error(
        `Repository ${owner}/${repo} not found in databse. Please reconnect the repository.`,
      );

    const githubAccount = repository.owner.accounts[0];

    if (!githubAccount.accessToken)
      throw new Error("No GitHub access token found for the repository owner");

    const token = githubAccount.accessToken;

    const { title, description, author } = await getPullRequestDiff(
      token,
      owner,
      repo,
      prNumber,
    );

    // Find or create PullRequest
    let pullRequest = await (prisma as any).pullRequest.findUnique({
      where: {
        repoId_number: {
          repoId: repository.id,
          number: prNumber,
        },
      },
    });

    if (!pullRequest) {
      pullRequest = await (prisma as any).pullRequest.create({
        data: {
          number: prNumber,
          title: title || "Untitled PR",
          url: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          repoId: repository.id,
          authorId: null, // TODO: implement author lookup
        },
      });
    }

    // Get default persona for user
    const defaultPersona = await prisma.persona.findFirst({
      where: { userId: repository.ownerId },
      orderBy: { createdAt: "asc" },
    });

    if (!defaultPersona) {
      throw new Error(
        "No persona found for user. Please create a persona first.",
      );
    }

    // Create Run
    const run = await (prisma as any).run.create({
      data: {
        prId: pullRequest.id,
        personaId: defaultPersona.id,
        status: "pending",
      },
    });

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        repo,
        prNumber,
        userId: repository.ownerId,
        runId: run.id,
      },
    });

    return {
      sucess: true,
      message: "Review Queued",
      runId: run.id,
    };
  } catch (error) {
    try {
      const repository = await prisma.repo.findFirst({
        where: {
          name: repo,
          fullName: `${owner}/${repo}`,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: "Failed to fetch PR",
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review: `Error: ${
              error instanceof Error ? error.message : "Unknown Error"
            }`,
            status: "failed",
            userId: repository.ownerId,
          },
        });
      }
    } catch (dbError) {
      console.error("Failed to save error to database: ", dbError);
    }
  }
}
