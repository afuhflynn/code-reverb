import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Code, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CodeReverb - AI-Powered Code Review Platform",
  description:
    "Learn about CodeReverb's mission to revolutionize code review processes. We're building the future of software development with AI-powered analysis and intelligent automation.",
  keywords: [
    "about CodeReverb",
    "code review platform",
    "AI-powered development",
    "automated code analysis",
    "developer productivity",
    "software quality",
    "team collaboration",
  ],
  openGraph: {
    title: "About CodeReverb - AI-Powered Code Review Platform",
    description:
      "Learn about CodeReverb's mission to revolutionize code review processes with AI-powered analysis and intelligent automation.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About CodeReverb - AI-Powered Code Review Platform",
    description:
      "Learn about CodeReverb's mission to revolutionize code review processes with AI-powered analysis and intelligent automation.",
  },
};

const stats = [
  { label: "Lines of code reviewed", value: "50M+" },
  { label: "Active repositories", value: "10K+" },
  { label: "Development teams", value: "500+" },
  { label: "Code issues caught", value: "99.9%" },
];

const values = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "We believe that code quality is the foundation of successful software development.",
  },
  {
    icon: Users,
    title: "Developer Experience",
    description:
      "Our tools are designed to make developers more productive and confident in their work.",
  },
  {
    icon: Code,
    title: "Innovation",
    description:
      "We continuously push the boundaries of what's possible with AI and automation.",
  },
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description:
      "We help teams ship better code faster by automating repetitive tasks.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              About CodeReverb
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Building the future of
              <span className="text-primary"> code review</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to revolutionize how development teams build
              software. By combining cutting-edge AI with deep understanding of
              development workflows, we're making code reviews faster, more
              thorough, and more collaborative.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              To empower every developer to ship high-quality code with
              confidence, by making expert-level code review accessible to teams
              of all sizes.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Why Code Review Matters
              </h3>
              <p className="text-muted-foreground mb-6">
                Code review is one of the most effective ways to improve code
                quality, catch bugs early, and share knowledge across teams.
                However, traditional code review processes are often slow,
                inconsistent, and resource-intensive.
              </p>
              <p className="text-muted-foreground mb-6">
                CodeReverb changes this by providing instant, AI-powered
                feedback that scales with your team's needs. Our platform learns
                from your coding standards and provides consistent, actionable
                feedback on every pull request.
              </p>
              <Button asChild>
                <Link href="/pricing">
                  See How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Instant feedback on code changes
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Consistent quality standards
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Faster development cycles
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Reduced technical debt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do at CodeReverb.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border-border bg-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powered by Advanced AI
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We leverage state-of-the-art machine learning models and
              specialized code analysis techniques to deliver unparalleled
              insights.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">
                    Google Gemini
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced multimodal capabilities for comprehensive code
                    understanding.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">OpenAI GPT</h4>
                  <p className="text-sm text-muted-foreground">
                    Natural language processing for clear, actionable feedback.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Custom Models
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Specialized models trained on millions of code reviews.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Analysis Techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">
                    Static Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Deep code analysis without execution for security and
                    quality checks.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Semantic Understanding
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Context-aware analysis that understands code intent and
                    purpose.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Pattern Recognition
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Machine learning models that learn from successful code
                    patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to transform your code reviews?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Join thousands of developers who have improved their code quality
              with CodeReverb.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base font-semibold"
                asChild
              >
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
