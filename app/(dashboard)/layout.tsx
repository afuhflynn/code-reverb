import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/lib/api-client";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth("/app");

  const user = await api.queries.users.getById(session.user.id);

  // Check if user has completed onboarding
  if (!user?.hasCompletedOnboarding) {
    redirect("/connect/github");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <Header />
        <main className="flex-1 overflow-auto pt-4 md:pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
