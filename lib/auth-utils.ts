"use server";

import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireAuth = async (redirectUrl?: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/auth?redirect=${encodeURIComponent(redirectUrl as string)}`);
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/app");
  }

  return session;
};
