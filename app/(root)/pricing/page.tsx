import type { Metadata } from "next";
import { PricingTable } from "@/components/pricing/pricing-table";
import { FAQSection } from "@/components/pricing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Pricing - CodeReverb",
  description:
    "Choose the perfect plan for your team's code review needs. From free tier to enterprise solutions, CodeReverb offers flexible pricing for every development team.",
  keywords: [
    "pricing",
    "plans",
    "subscription",
    "code review pricing",
    "AI code analysis pricing",
    "developer tools pricing",
  ],
  openGraph: {
    title: "Pricing - CodeReverb",
    description:
      "Choose the perfect plan for your team's code review needs. From free tier to enterprise solutions.",
    type: "website",
    url: "/pricing",
  },
  twitter: {
    card: "summary",
    title: "Pricing - CodeReverb",
    description:
      "Choose the perfect plan for your team's code review needs. From free tier to enterprise solutions.",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Choose the plan that fits your team's needs. All plans include a
              14-day free trial. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <PricingTable />
      <FAQSection />
      <CTASection />
    </div>
  );
}
