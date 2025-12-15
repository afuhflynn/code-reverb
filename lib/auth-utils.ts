"use server";

import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth");
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
