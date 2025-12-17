"use server";

import { getPullRequestDiff } from "@/lib/github-utils/actions";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number
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
        `Repository ${owner}/${repo} not found in databse. Please reconnect the repository.`
      );

    const githubAccount = repository.owner.accounts[0];

    if (!githubAccount.accessToken)
      throw new Error("No GitHub access token found for the repository owner");

    const token = githubAccount.accessToken;

    const { title } = await getPullRequestDiff(token, owner, repo, prNumber);

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        repo,
        prNumber,
        userId: repository.ownerId,
      },
    });

    return {
      sucess: true,
      message: "Review Queued",
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
          },
        });
      }
    } catch (dbError) {
      console.error("Failed to save error to database: ", dbError);
    }
  }
}
