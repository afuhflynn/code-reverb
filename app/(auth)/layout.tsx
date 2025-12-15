import { requireUnAuth } from "@/lib/auth-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Code-Reverb",
  description:
    "Sign in to Code-Reverb with your GitHub account to access AI-powered code review tools and analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();

  return <div className="min-h-screen">{children}</div>;
}
