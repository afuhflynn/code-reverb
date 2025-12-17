import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "5 repositories",
      "50 reviews per month",
      "Basic AI analysis",
      "GitHub integration",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing development teams",
    features: [
      "Unlimited repositories",
      "500 reviews per month",
      "Advanced AI analysis",
      "Custom personas",
      "Priority support",
      "Team analytics",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited reviews",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

export function PricingPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your team's needs. Upgrade or downgrade at
            any time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative border-border bg-card ${
                tier.popular
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-lg"
              } transition-shadow`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">
                  {tier.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  {tier.name === "Enterprise" ? (
                    <Button
                      className="w-full"
                      variant={tier.buttonVariant}
                      asChild
                    >
                      <Link href="/contact">{tier.buttonText}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={tier.buttonVariant}
                      asChild
                    >
                      <Link href="/pricing">{tier.buttonText}</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include 14-day free trial. No credit card required.
          </p>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="text-primary hover:text-primary/80 font-medium"
            >
              View detailed pricing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
