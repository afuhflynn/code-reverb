import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image as string,
          }}
        />

        <main className="flex-1 overflow-auto pt-4 md:pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
