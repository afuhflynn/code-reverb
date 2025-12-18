import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  AlertCircle,
  Scale,
  Users,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Usage Agreement",
  description:
    "Read CodeReverb's terms of service. Understand your rights, responsibilities, and the legal framework for using our AI-powered code review platform.",
  keywords: [
    "terms of service",
    "usage agreement",
    "legal terms",
    "user responsibilities",
    "service conditions",
    "subscription terms",
  ],
  openGraph: {
    title: "Terms of Service - Usage Agreement",
    description:
      "Read CodeReverb's terms of service. Understand your rights, responsibilities, and the legal framework for using our AI-powered code review platform.",
    type: "website",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - Usage Agreement",
    description:
      "Read CodeReverb's terms of service. Understand your rights, responsibilities, and the legal framework for using our AI-powered code review platform.",
  },
};

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing and using CodeReverb, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all users, including visitors, registered users, and premium subscribers.",
  },
  {
    icon: Shield,
    title: "Service Description & License",
    content:
      "CodeReverb provides AI-powered code review services for GitHub repositories. We grant you a limited, non-exclusive, non-transferable license to access and use our platform in accordance with these terms and applicable law.",
  },

  {
    icon: AlertCircle,
    title: "Service Availability & Limitations",
    content:
      "While we strive for high availability, we do not guarantee uninterrupted service. AI-generated reviews are provided 'as-is' and should be reviewed by qualified developers. We are not liable for any damages from service interruptions.",
  },
  {
    icon: Scale,
    title: "Billing, Payment & Subscriptions",
    content:
      "Subscription fees are billed in advance and are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice. Failed payments may result in service suspension.",
  },
  {
    icon: XCircle,
    title: "Termination & Account Closure",
    content:
      "Either party may terminate this agreement at any time. Upon termination, your right to use the service ceases immediately. We may suspend or terminate accounts that violate these terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Terms of Service
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms and conditions for
              <span className="text-primary"> using CodeReverb</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Please read these terms carefully before using our platform. By
              using CodeReverb, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            {sections.map((section, index) => (
              <Card key={section.title} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        Section {index + 1}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Governing Law */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  Governing Law & Dispute Resolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  These terms shall be interpreted and governed by the laws of
                  the State of Delaware, United States, without regard to
                  conflict of law provisions. Any disputes arising from these
                  terms shall be resolved through binding arbitration in
                  accordance with the rules of the American Arbitration
                  Association.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Severability & Entire Agreement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    If any provision of these terms is found to be
                    unenforceable, the remaining provisions will remain in full
                    force and effect. These terms constitute the entire
                    agreement between you and CodeReverb regarding the use of
                    our service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  Questions About These Terms?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service or need
                  clarification, please contact our legal team:
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@codereverb.dev"
                      className="text-primary hover:text-primary/80"
                    >
                      legal@codereverb.dev
                    </a>
                  </p>
                  <p className="text-foreground">
                    <strong>Response Time:</strong> Within 72 hours
                  </p>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    For urgent legal matters or DMCA takedown requests, please
                    contact us at{" "}
                    <a
                      href="mailto:legal@codereverb.dev"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      legal@codereverb.dev
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6">
              By using CodeReverb, you agree to these terms of service.
            </p>
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Accept & Continue
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
