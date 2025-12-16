"use client";

import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { SettingsContent } from "@/components/settings/settings-content";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);

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
            <SettingsSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <SettingsContent
              activeSection={activeSection}
              hasChanges={hasChanges}
              setHasChanges={setHasChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
