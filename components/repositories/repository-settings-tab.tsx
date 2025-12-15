import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bot,
  Users,
  Bell,
  Shield,
  Save,
  RefreshCw,
} from "lucide-react";

interface RepositorySettingsTabProps {
  repositoryId: string;
}

const mockSettings = {
  aiEnabled: true,
  selectedPersona: "code-reviewer-pro",
  autoReview: true,
  reviewThreshold: "medium",
  notifications: {
    emailOnComplete: true,
    slackNotifications: false,
    webhookUrl: "",
  },
  permissions: {
    allowPublicPRs: false,
    requireApproval: true,
    maxReviewTime: 7,
  },
  webhooks: [
    { id: 1, url: "https://api.example.com/webhook", active: true },
    { id: 2, url: "https://slack.example.com/webhook", active: false },
  ],
};

export function RepositorySettingsTab({
  repositoryId,
}: RepositorySettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Reviews</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to automatically review pull requests
              </p>
            </div>
            <Switch defaultChecked={mockSettings.aiEnabled} />
          </div>

          <div className="space-y-2">
            <Label>AI Persona</Label>
            <Select defaultValue={mockSettings.selectedPersona}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code-reviewer-basic">
                  Code Reviewer Basic
                </SelectItem>
                <SelectItem value="code-reviewer-pro">
                  Code Reviewer Pro
                </SelectItem>
                <SelectItem value="security-expert">Security Expert</SelectItem>
                <SelectItem value="performance-optimizer">
                  Performance Optimizer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-start Reviews</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start AI review when PR is opened
              </p>
            </div>
            <Switch defaultChecked={mockSettings.autoReview} />
          </div>

          <div className="space-y-2">
            <Label>Review Threshold</Label>
            <Select defaultValue={mockSettings.reviewThreshold}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Quick reviews)</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="high">High (Thorough reviews)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email when reviews are completed
              </p>
            </div>
            <Switch
              defaultChecked={mockSettings.notifications.emailOnComplete}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Integration</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to Slack channels
              </p>
            </div>
            <Switch
              defaultChecked={mockSettings.notifications.slackNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://your-app.com/webhook"
              defaultValue={mockSettings.notifications.webhookUrl}
            />
            <p className="text-sm text-muted-foreground">
              Receive webhook notifications for review events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Public PRs</Label>
              <p className="text-sm text-muted-foreground">
                Review pull requests from public contributors
              </p>
            </div>
            <Switch defaultChecked={mockSettings.permissions.allowPublicPRs} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Manual Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require admin approval before AI reviews start
              </p>
            </div>
            <Switch defaultChecked={mockSettings.permissions.requireApproval} />
          </div>

          <div className="space-y-2">
            <Label>Maximum Review Time (days)</Label>
            <Input
              type="number"
              defaultValue={mockSettings.permissions.maxReviewTime}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Repository Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSettings.webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge variant={webhook.active ? "default" : "secondary"}>
                  {webhook.active ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm font-mono">{webhook.url}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Test
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Add Webhook
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
