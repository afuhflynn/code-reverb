"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  createWebHook,
  deleteWebHook,
  getRepositories,
} from "@/lib/github-utils";
import { revalidatePath } from "next/cache";
import { inngest } from "@/lib/inngest";

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
        username: owner,
      },
    });
  }

  // Trigger repo indexing
  try {
    await inngest.send({
      name: "repository.connected",
      data: {
        owner,
        repo,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.log("Failed to trigger repository indexing: ", error);
  }

  return webhook;
}

export async function getConnectedRepositories() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const repositories = await prisma.repo.findMany({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        username: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return repositories;
  } catch (error) {
    console.error("Failed to get connected repositories", error);
    return [];
  }
}

export async function disconnectRepo(repoId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
    });

    if (!repo || repo.ownerId !== session.user.id) {
      throw new Error("Repository not found or access denied");
    }

    await prisma.repo.delete({
      where: { id: repoId },
    });
    await deleteWebHook(repo.username, repo.name);
    revalidatePath("/settings", "page");
    revalidatePath("/repositories", "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to disconnect repository",
    };
  }
}

export async function disconnectAllRepos() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const repos = await getConnectedRepositories();
    await Promise.all(
      repos.map(async (repo) => {
        await deleteWebHook(repo.username, repo.name);
      })
    );

    const result = await prisma.repo.deleteMany({
      where: {
        ownerId: session.user.id,
      },
    });

    revalidatePath("/settings", "page");
    revalidatePath("/repositories", "page");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Failed to disconnect from repositories", error);
    return { success: false, error: "Failed to disconnect from repositories" };
  }
}
