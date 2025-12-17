import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AppHero from "@/components/mvpblocks/app-hero";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHero />
      {/* <HeroSection /> */}
      <FeaturesSection />
      <PricingPreview />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
