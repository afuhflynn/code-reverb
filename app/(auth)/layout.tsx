import type { Metadata } from "next";
import { requireUnAuth } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Sign In - CodeReverb",
  description:
    "Sign in to CodeReverb with your GitHub account to access AI-powered code review tools and analytics.",
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
