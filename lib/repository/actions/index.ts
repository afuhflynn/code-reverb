"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRepositories } from "@/lib/github-utils";

export async function fetchRespositories(
  page: number = 1,
  perPage: number = 10
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  const githubRepos = await getRepositories(page, perPage);
  const dbRepos = await prisma.repo.findMany({
    where: {
      ownerId: session.user.id,
    },
  });

  const connetedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));

  return githubRepos.map((repo) => ({
    ...repo,
    isConnected: connetedRepoIds.has(BigInt(repo.id)),
  }));
}
