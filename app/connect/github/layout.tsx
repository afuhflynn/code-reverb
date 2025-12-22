import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth("/connect/github");

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  // Check if user has completed onboarding
  if (user?.hasCompletedOnboarding) {
    redirect("/app");
  }

  return <div className="h-screen w-screen">{children}</div>;
}
