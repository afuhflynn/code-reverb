import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Settings,
  BarChart3,
  CreditCard,
  Database,
  Shield,
  Activity,
} from "lucide-react";

const adminSections = [
  {
    id: "users",
    name: "User Management",
    icon: Users,
    description: "Manage platform users and permissions",
    category: "users",
  },
  {
    id: "organizations",
    name: "Organizations",
    icon: Building,
    description: "Manage organization accounts and settings",
    category: "organizations",
  },
  {
    id: "system",
    name: "System Settings",
    icon: Settings,
    description: "Platform configuration and maintenance",
    category: "system",
  },
  {
    id: "analytics",
    name: "Platform Analytics",
    icon: BarChart3,
    description: "Global usage statistics and insights",
    category: "analytics",
  },
  {
    id: "billing",
    name: "Billing Oversight",
    icon: CreditCard,
    description: "Monitor subscriptions and payments",
    category: "billing",
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    description: "Database management and maintenance",
    category: "system",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Security monitoring and policies",
    category: "security",
  },
  {
    id: "monitoring",
    name: "System Monitoring",
    icon: Activity,
    description: "Real-time system health and performance",
    category: "system",
  },
];

export function AdminSidebar() {
  const userSections = adminSections.filter((s) => s.category === "users");
  const orgSections = adminSections.filter(
    (s) => s.category === "organizations",
  );
  const systemSections = adminSections.filter((s) => s.category === "system");
  const analyticsSections = adminSections.filter(
    (s) => s.category === "analytics",
  );
  const billingSections = adminSections.filter((s) => s.category === "billing");
  const securitySections = adminSections.filter(
    (s) => s.category === "security",
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">89</div>
              <div className="text-xs text-muted-foreground">Organizations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Users
          </h3>
          <div className="space-y-1">
            {userSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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

      {/* Organizations */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Organizations
          </h3>
          <div className="space-y-1">
            {orgSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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

      {/* System */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            System
          </h3>
          <div className="space-y-1">
            {systemSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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

      {/* Analytics */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Analytics
          </h3>
          <div className="space-y-1">
            {analyticsSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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

      {/* Billing */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Billing
          </h3>
          <div className="space-y-1">
            {billingSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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

      {/* Security */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Security
          </h3>
          <div className="space-y-1">
            {securitySections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
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
