import { AdminContent } from "@/components/admin/admin-content";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAuth } from "@/lib/auth-utils";

export default async function AdminPage() {
  await requireAuth("/admin");

  // TODO: Check if user is admin
  const isAdmin = true; // Mock for now

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Platform administration and management tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Admin Navigation Sidebar */}
          <div className="lg:col-span-1">
            <AdminSidebar />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AdminContent />
          </div>
        </div>
      </div>
    </div>
  );
}
