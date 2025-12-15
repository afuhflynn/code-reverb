"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Github,
  Save,
  RotateCcw,
  Download,
  Key,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CreditCard,
  Building,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

export function SettingsContent() {
  const [activeSection, setActiveSection] = useState("profile");

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Senior software engineer passionate about code quality",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    github: "https://github.com/johndoe",
    avatar: "https://github.com/johndoe.png",
  });

  const [notifications, setNotifications] = useState({
    email: {
      reviewCompleted: true,
      reviewFailed: true,
      newRepository: true,
      weeklySummary: true,
      marketing: false,
    },
    inApp: {
      aiInsights: true,
      teamMentions: true,
      systemMaintenance: true,
    },
  });

  const [aiSettings, setAiSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    defaultPersona: "code-quality",
    autoReview: true,
    qualityThreshold: 7.0,
  });

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={userData.bio}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={userData.location}
                onChange={(e) =>
                  setUserData({ ...userData, location: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={userData.website}
                onChange={(e) =>
                  setUserData({ ...userData, website: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">GitHub Profile</label>
            <Input
              value={userData.github}
              onChange={(e) =>
                setUserData({ ...userData, github: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show email address</p>
              <p className="text-sm text-muted-foreground">
                Make your email visible on your public profile
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show location</p>
              <p className="text-sm text-muted-foreground">
                Display your location on your public profile
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" className="mt-1" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Chrome on MacBook Pro</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA • Active now
                </p>
              </div>
              <Badge>Current</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA • 2 hours ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Revoke All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review completed</p>
              <p className="text-sm text-muted-foreground">
                When AI finishes reviewing your code
              </p>
            </div>
            <Switch
              checked={notifications.email.reviewCompleted}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  email: { ...notifications.email, reviewCompleted: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review failed</p>
              <p className="text-sm text-muted-foreground">
                When AI review encounters an error
              </p>
            </div>
            <Switch
              checked={notifications.email.reviewFailed}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  email: { ...notifications.email, reviewFailed: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New repository added</p>
              <p className="text-sm text-muted-foreground">
                When repositories are connected
              </p>
            </div>
            <Switch
              checked={notifications.email.newRepository}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  email: { ...notifications.email, newRepository: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly summary</p>
              <p className="text-sm text-muted-foreground">
                Weekly review activity summary
              </p>
            </div>
            <Switch
              checked={notifications.email.weeklySummary}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  email: { ...notifications.email, weeklySummary: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI insights available</p>
              <p className="text-sm text-muted-foreground">
                When new AI recommendations are ready
              </p>
            </div>
            <Switch
              checked={notifications.inApp.aiInsights}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  inApp: { ...notifications.inApp, aiInsights: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Team mentions</p>
              <p className="text-sm text-muted-foreground">
                When mentioned in reviews or comments
              </p>
            </div>
            <Switch
              checked={notifications.inApp.teamMentions}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  inApp: { ...notifications.inApp, teamMentions: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Temperature</label>
              <div className="mt-1">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={aiSettings.temperature}
                  onChange={(e) =>
                    setAiSettings({
                      ...aiSettings,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conservative (0.0)</span>
                  <span className="font-medium">{aiSettings.temperature}</span>
                  <span>Creative (2.0)</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Max Tokens</label>
              <Select
                value={aiSettings.maxTokens.toString()}
                onValueChange={(value) =>
                  setAiSettings({ ...aiSettings, maxTokens: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512 (Short responses)</SelectItem>
                  <SelectItem value="1024">1024 (Standard)</SelectItem>
                  <SelectItem value="2048">2048 (Detailed)</SelectItem>
                  <SelectItem value="4096">4096 (Comprehensive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Default Persona</label>
            <Select
              value={aiSettings.defaultPersona}
              onValueChange={(value) =>
                setAiSettings({ ...aiSettings, defaultPersona: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code-quality">
                  Code Quality Expert
                </SelectItem>
                <SelectItem value="security">Security Guardian</SelectItem>
                <SelectItem value="performance">
                  Performance Optimizer
                </SelectItem>
                <SelectItem value="documentation">
                  Documentation Guide
                </SelectItem>
                <SelectItem value="testing">Testing Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-review new PRs</p>
              <p className="text-sm text-muted-foreground">
                Automatically start AI review when PRs are created
              </p>
            </div>
            <Switch
              checked={aiSettings.autoReview}
              onCheckedChange={(checked) =>
                setAiSettings({ ...aiSettings, autoReview: checked })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Quality Threshold</label>
            <div className="mt-1">
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={aiSettings.qualityThreshold}
                onChange={(e) =>
                  setAiSettings({
                    ...aiSettings,
                    qualityThreshold: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low (1.0)</span>
                <span className="font-medium">
                  {aiSettings.qualityThreshold}
                </span>
                <span>High (10.0)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">AC</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Logo
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG or SVG. Max size 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <Input defaultValue="Acme Corp" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input defaultValue="https://acme.com" className="mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              defaultValue="Leading software development company specializing in AI-powered solutions."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members (12 total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@acme.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Admin</Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">jane@acme.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Developer</Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">Enterprise</p>
              <p className="text-muted-foreground">$99/month</p>
              <p className="text-sm text-muted-foreground">
                Next billing: February 15, 2025
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">January 2025</p>
                <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$99.00</p>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Download
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">December 2024</p>
                <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$99.00</p>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "account":
        return renderAccountSettings();
      case "notifications":
        return renderNotificationSettings();
      case "ai":
        return renderAISettings();
      case "organization":
        return renderOrganizationSettings();
      case "billing":
        return renderBillingSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Changes will be saved automatically
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
