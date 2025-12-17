import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Get Support & Sales Help",
  description:
    "Get in touch with CodeReverb. Contact our sales team for enterprise solutions, technical support for help, or general inquiries. We're here to help you succeed.",
  keywords: [
    "contact CodeReverb",
    "technical support",
    "customer service",
    "enterprise sales",
    "help center",
    "support team",
  ],
  openGraph: {
    title: "Contact Us - Get Support & Sales Help",
    description:
      "Get in touch with CodeReverb. Contact our sales team for enterprise solutions, technical support for help, or general inquiries.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - Get Support & Sales Help",
    description:
      "Get in touch with CodeReverb. Contact our sales team for enterprise solutions, technical support for help, or general inquiries.",
  },
};

const contactMethods = [
  {
    icon: Mail,
    title: "General Inquiries",
    description: "Questions about our platform or getting started",
    contact: "hello@codereverb.dev",
    response: "Within 24 hours",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "Technical Support",
    description: "Help with integrations, bugs, or troubleshooting",
    contact: "support@codereverb.dev",
    response: "Within 4 hours",
    badge: "Priority",
  },
  {
    icon: Phone,
    title: "Enterprise Sales",
    description: "Custom solutions, pricing, and partnerships",
    contact: "sales@codereverb.dev",
    response: "Within 12 hours",
    badge: "Enterprise",
  },
  {
    icon: Mail,
    title: "Security & Privacy",
    description: "Security concerns or data protection questions",
    contact: "security@codereverb.dev",
    response: "Within 6 hours",
    badge: "Urgent",
  },
];

const officeInfo = {
  location: "San Francisco, CA",
  timezone: "PST (UTC-8)",
  hours: "Monday - Friday, 9 AM - 6 PM PST",
  phone: "+1 (555) 123-4567",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How can we help you
              <span className="text-primary"> succeed?</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need technical support, have questions about our
              platform, or want to discuss enterprise solutions, our team is
              here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="border-border bg-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    {method.badge && (
                      <Badge
                        variant={
                          method.badge === "Enterprise"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {method.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {method.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${method.contact}`}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        {method.contact}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {method.response}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
                Get in touch with our team
              </h2>
              <p className="text-muted-foreground mb-8">
                Prefer to speak with someone directly? Our offices are located
                in the heart of San Francisco's tech district. We're always
                happy to meet in person or hop on a call.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{officeInfo.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{officeInfo.hours}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{officeInfo.phone}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <a href="tel:+15551234567">Call Us Now</a>
                </Button>
              </div>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Office Hours & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Support Hours
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Our technical support team is available during business
                    hours. Enterprise customers have 24/7 access to emergency
                    support.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Response Times
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        General inquiries
                      </span>
                      <span className="text-foreground">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Technical support
                      </span>
                      <span className="text-foreground">4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Enterprise sales
                      </span>
                      <span className="text-foreground">12 hours</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="https://twitter.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
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
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Join thousands of developers who trust CodeReverb for their code
              review needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base font-semibold"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
