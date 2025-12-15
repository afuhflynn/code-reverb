import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Webhook,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepositoryWebhooksTabProps {
  repositoryId: string;
}

const mockWebhooks = [
  {
    id: 1,
    url: "https://api.example.com/github-webhook",
    events: ["pull_request", "push"],
    secret: "wh_sec_1234567890abcdef",
    active: true,
    lastDelivery: new Date(Date.now() - 30 * 60 * 1000),
    lastStatus: "success",
    deliveries: 245,
  },
  {
    id: 2,
    url: "https://slack.example.com/code-reverb",
    events: ["pull_request_review"],
    secret: "wh_sec_abcdef1234567890",
    active: true,
    lastDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastStatus: "success",
    deliveries: 89,
  },
  {
    id: 3,
    url: "https://monitoring.example.com/alerts",
    events: ["pull_request", "issues"],
    secret: "wh_sec_0987654321fedcba",
    active: false,
    lastDelivery: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastStatus: "failed",
    deliveries: 156,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-orange-600" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RepositoryWebhooksTab({
  repositoryId,
}: RepositoryWebhooksTabProps) {
  return (
    <div className="space-y-6">
      {/* Webhook List */}
      <div className="space-y-4">
        {mockWebhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Webhook className="h-5 w-5 text-muted-foreground" />
                    <div className="font-mono text-sm break-all">
                      {webhook.url}
                    </div>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Events: {webhook.events.join(", ")}</span>
                    <span>{webhook.deliveries} deliveries</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(webhook.lastStatus)}
                      <span>
                        Last:{" "}
                        {formatDistanceToNow(webhook.lastDelivery, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono">
                    Secret: {webhook.secret.substring(0, 12)}...
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payload URL</Label>
            <Input placeholder="https://your-app.com/webhook" />
          </div>

          <div className="space-y-2">
            <Label>Events</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select events to trigger webhook" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pull_request">Pull Request</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="issues">Issues</SelectItem>
                <SelectItem value="pull_request_review">PR Review</SelectItem>
                <SelectItem value="release">Release</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Secret (Optional)</Label>
            <Input placeholder="Webhook secret for verification" />
            <p className="text-sm text-muted-foreground">
              Used to verify webhook payloads from GitHub
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              className="rounded"
              defaultChecked
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 1,
                event: "pull_request.opened",
                status: "success",
                time: new Date(Date.now() - 5 * 60 * 1000),
              },
              {
                id: 2,
                event: "push",
                status: "success",
                time: new Date(Date.now() - 15 * 60 * 1000),
              },
              {
                id: 3,
                event: "pull_request_review.submitted",
                status: "failed",
                time: new Date(Date.now() - 30 * 60 * 1000),
              },
              {
                id: 4,
                event: "pull_request.merged",
                status: "success",
                time: new Date(Date.now() - 45 * 60 * 1000),
              },
            ].map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(delivery.status)}
                  <span className="text-sm">{delivery.event}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(delivery.time, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
