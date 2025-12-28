"use server";

import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";

export async function completeOnboarding() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not authenticated");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { hasCompletedOnboarding: true },
  });
}
