"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Eye,
  Key,
  Github,
  Palette,
  Bot,
  Zap,
  Building,
  CreditCard,
  Search,
} from "lucide-react";

const settingsSections = [
  {
    id: "profile",
    name: "Profile",
    icon: User,
    description: "Manage your personal information",
    category: "personal",
  },
  {
    id: "account",
    name: "Account & Security",
    icon: Shield,
    description: "Password, 2FA, and security settings",
    category: "personal",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "Email and in-app notification preferences",
    category: "personal",
  },
  {
    id: "privacy",
    name: "Privacy",
    icon: Eye,
    description: "Data sharing and privacy controls",
    category: "personal",
  },
  {
    id: "security",
    name: "API & Integrations",
    icon: Key,
    description: "API keys, webhooks, and integrations",
    category: "personal",
  },
  {
    id: "ai",
    name: "AI Preferences",
    icon: Bot,
    description: "AI model settings and preferences",
    category: "personal",
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: Palette,
    description: "Theme, language, and display settings",
    category: "platform",
  },
  {
    id: "organization",
    name: "Organization",
    icon: Building,
    description: "Organization settings and members",
    category: "organization",
    badge: "Admin",
  },
  {
    id: "billing",
    name: "Billing & Subscription",
    icon: CreditCard,
    description: "Payment methods and billing history",
    category: "billing",
  },
];

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function SettingsSidebar({
  activeSection,
  setActiveSection,
}: SettingsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter sections based on search term
  const filteredSections = settingsSections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const personalSections = filteredSections.filter(
    (s) => s.category === "personal",
  );
  const platformSections = filteredSections.filter(
    (s) => s.category === "platform",
  );
  const orgSections = filteredSections.filter(
    (s) => s.category === "organization",
  );
  const billingSections = filteredSections.filter(
    (s) => s.category === "billing",
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Personal
          </h3>
          <div className="space-y-1">
            {personalSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {section.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Platform
          </h3>
          <div className="space-y-1">
            {platformSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {section.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Organization
          </h3>
          <div className="space-y-1">
            {orgSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {section.name}
                    {section.badge && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {section.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Billing
          </h3>
          <div className="space-y-1">
            {billingSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {section.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
