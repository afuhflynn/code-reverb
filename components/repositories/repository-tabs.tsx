"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitPullRequest, BarChart3, Settings, Webhook } from "lucide-react";
import { RepositoryPRsTab } from "./repository-prs-tab";
import { RepositoryAnalyticsTab } from "./repository-analytics-tab";
import { RepositorySettingsTab } from "./repository-settings-tab";
import { RepositoryWebhooksTab } from "./repository-webhooks-tab";

interface RepositoryTabsProps {
  repositoryId: string;
}

export function RepositoryTabs({ repositoryId }: RepositoryTabsProps) {
  return (
    <Tabs defaultValue="prs" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="prs" className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4" />
          Pull Requests
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
        <TabsTrigger value="webhooks" className="flex items-center gap-2">
          <Webhook className="h-4 w-4" />
          Webhooks
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prs" className="space-y-6">
        <RepositoryPRsTab repositoryId={repositoryId} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <RepositoryAnalyticsTab repositoryId={repositoryId} />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <RepositorySettingsTab repositoryId={repositoryId} />
      </TabsContent>

      <TabsContent value="webhooks" className="space-y-6">
        <RepositoryWebhooksTab repositoryId={repositoryId} />
      </TabsContent>
    </Tabs>
  );
}
