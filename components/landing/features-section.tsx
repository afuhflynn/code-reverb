import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Seamless GitHub Integration",
    description:
      "Connect your repositories and get automated reviews on every pull request with zero configuration.",
    badge: "Popular",
  },
  {
    icon: Shield,
    title: "Security & Best Practices",
    description:
      "Catch security vulnerabilities, code smells, and maintain consistency with automated analysis.",
    badge: null,
  },
  {
    icon: Zap,
    title: "Lightning Fast Reviews",
    description:
      "Get comprehensive feedback in minutes, not hours. Never wait for human reviewers again.",
    badge: "Fast",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Custom personas for different review styles. Scale your team's code quality standards.",
    badge: null,
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track team performance, identify patterns, and continuously improve your development process.",
    badge: null,
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Ensure code meets your standards with automated checks and detailed feedback.",
    badge: null,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for better code
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to help development teams ship
            high-quality code faster and more confidently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="relative border-border bg-card hover:shadow-lg transition-shadow"
            >
              {feature.badge && (
                <div className="absolute -top-2 -right-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary text-primary-foreground"
                  >
                    {feature.badge}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code example */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Before & After Code Review
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    2 min review
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Before */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  ❌ Before
                </div>
                <div className="rounded bg-destructive/5 border border-destructive/20 p-4">
                  <pre className="text-sm text-destructive">
                    {`const user = db.query(
  \`SELECT * FROM users WHERE id = \${userId}\`
);`}
                  </pre>
                </div>
                <div className="text-sm text-muted-foreground">
                  Vulnerable to SQL injection attacks
                </div>
              </div>

              {/* After */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  ✅ After
                </div>
                <div className="rounded bg-primary/5 border border-primary/20 p-4">
                  <pre className="text-sm text-primary">
                    {`const user = db.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);`}
                  </pre>
                </div>
                <div className="text-sm text-muted-foreground">
                  Secure parameterized query
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
