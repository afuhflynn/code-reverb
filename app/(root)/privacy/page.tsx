import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, UserCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection & Security",
  description:
    "Learn how CodeReverb protects your data and respects your privacy. Our comprehensive privacy policy covers data collection, usage, security measures, and your rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "security measures",
    "data rights",
    "privacy controls",
  ],
  openGraph: {
    title: "Privacy Policy - Data Protection & Security",
    description:
      "Learn how CodeReverb protects your data and respects your privacy with our comprehensive privacy policy.",
    type: "website",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - Data Protection & Security",
    description:
      "Learn how CodeReverb protects your data and respects your privacy with our comprehensive privacy policy.",
  },
};

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes account information, usage data, and communication records.",
  },
  {
    icon: UserCheck,
    title: "How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our services; process transactions; send technical notices; communicate about products and services; and ensure platform security and compliance.",
  },
  {
    icon: Shield,
    title: "Information Sharing & Disclosure",
    content:
      "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent. We may share data only as required by law, with service providers under strict confidentiality, or in aggregated form.",
  },
  {
    icon: Lock,
    title: "Data Security & Protection",
    content:
      "We implement industry-standard security measures including encryption, access controls, regular security audits, and compliance with SOC 2 and GDPR standards to protect your personal information.",
  },
  {
    icon: AlertTriangle,
    title: "Your Rights & Controls",
    content:
      "You have the right to access, update, delete, or export your personal information. You can opt out of marketing communications, restrict processing, and request data portability at any time.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Privacy Policy
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Your privacy and data security
              <span className="text-primary"> matter to us</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We are committed to protecting your personal information and being
              transparent about how we collect, use, and safeguard your data.
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

            {/* Additional Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  GDPR Compliance & International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  CodeReverb complies with the General Data Protection
                  Regulation (GDPR) and other applicable privacy laws. We
                  implement appropriate safeguards for international data
                  transfers and provide mechanisms for EU residents to exercise
                  their rights.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Data Processing Locations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your data may be processed in the United States and other
                    jurisdictions where our service providers operate. We ensure
                    all transfers comply with applicable data protection laws
                    through standard contractual clauses and other safeguards.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  Contact Our Privacy Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact our privacy team:
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@codereverb.dev"
                      className="text-primary hover:text-primary/80"
                    >
                      privacy@codereverb.dev
                    </a>
                  </p>
                  <p className="text-foreground">
                    <strong>Response Time:</strong> Within 48 hours
                  </p>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    For urgent privacy concerns or data breach reports, please
                    contact us immediately at{" "}
                    <a
                      href="mailto:security@codereverb.dev"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      security@codereverb.dev
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
              Questions about your privacy?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our privacy team is here to help you understand how we protect
              your data.
            </p>
            <a
              href="mailto:privacy@codereverb.dev"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
