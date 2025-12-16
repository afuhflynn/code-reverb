"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createWebHook, getRepositories } from "@/lib/github-utils";

export async function fetchRespositories(
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  status: string = "all"
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  const githubRepos = await getRepositories(page, perPage, search, status);
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

export async function connectRepo(
  owner: string,
  repo: string,
  githubId: number
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  const webhook = await createWebHook(owner, repo);

  if (webhook) {
    await prisma.repo.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        ownerId: session.user.id,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}.git`,
      },
    });
  }

  // TODO: Trigger repo indexing

  return webhook;
}
