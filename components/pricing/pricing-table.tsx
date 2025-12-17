import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small projects",
    icon: Check,
    features: [
      "5 repositories",
      "50 reviews per month",
      "Basic AI analysis",
      "GitHub integration",
      "Community support",
      "Standard review templates",
    ],
    limitations: [
      "Limited to personal use",
      "Basic analytics only",
      "No custom personas",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    cta: "/auth/signup",
  },
  {
    name: "Starter",
    price: "$19",
    period: "per month",
    description: "For small teams getting started with AI reviews",
    icon: Star,
    features: [
      "25 repositories",
      "500 reviews per month",
      "Advanced AI analysis",
      "Custom personas",
      "Email support",
      "Basic analytics dashboard",
      "Review history & insights",
      "Integration with popular tools",
    ],
    limitations: [
      "Team size up to 10 members",
      "Standard support hours",
      "Limited API access",
    ],
    buttonText: "Start Starter Trial",
    buttonVariant: "default" as const,
    popular: false,
    cta: "/auth/signup?plan=starter",
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description:
      "For growing teams that need comprehensive code review automation",
    icon: Zap,
    features: [
      "Unlimited repositories",
      "2,000 reviews per month",
      "Premium AI models",
      "Advanced custom personas",
      "Priority email support",
      "Comprehensive analytics",
      "Team management tools",
      "Advanced integrations",
      "Custom review rules",
      "API access",
    ],
    limitations: [
      "Team size up to 50 members",
      "Phone support during business hours",
      "Advanced reporting",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true,
    cta: "/auth/signup?plan=professional",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with complex requirements",
    icon: Star,
    features: [
      "Everything in Professional",
      "Unlimited reviews",
      "Unlimited team size",
      "Dedicated success manager",
      "24/7 phone & chat support",
      "White-label solution",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantees",
      "On-premise deployment option",
    ],
    limitations: [],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
    cta: "/contact",
  },
];

export function PricingTable() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative border-border bg-card ${
                tier.popular
                  ? "ring-2 ring-primary shadow-xl scale-105"
                  : "hover:shadow-lg"
              } transition-all duration-200`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <tier.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period !== "pricing" && (
                    <span className="text-muted-foreground">
                      /{tier.period}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <span className="text-sm text-muted-foreground">
                            • {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    className="w-full"
                    variant={tier.buttonVariant}
                    size="lg"
                    asChild
                  >
                    <Link href={tier.cta}>{tier.buttonText}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              All plans include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                No setup fees
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
