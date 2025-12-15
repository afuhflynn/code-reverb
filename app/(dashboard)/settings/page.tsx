import { requireAuth } from "@/lib/auth-utils";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  const session = await requireAuth("/settings");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and platform settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="lg:col-span-1">
            <SettingsSidebar />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <SettingsContent />
          </div>
        </div>
      </div>
    </div>
  );
}
