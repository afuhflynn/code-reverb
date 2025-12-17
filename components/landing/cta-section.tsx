import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
  "Full feature access",
];

export function CTASection() {
  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to ship better code?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Join thousands of developers who have transformed their code review
            process. Start your free trial today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center justify-center sm:justify-start"
              >
                <CheckCircle className="h-5 w-5 text-primary-foreground/80 mr-2" />
                <span className="text-sm text-primary-foreground/80">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-primary-foreground/60">
              Trusted by developers at startups and Fortune 500 companies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
