import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 z-20" />
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground mb-8">
            <Star className="mr-2 h-4 w-4 fill-primary text-primary" />
            Trusted by 1000+ development teams
          </div>

          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Ship Better Code,
            <span className="text-primary"> Faster</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Automate code reviews for your team. Catch bugs, security issues,
            and maintain quality standards with intelligent analysis that
            integrates seamlessly into your workflow.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Social proof metrics */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">500K+</div>
              <div className="text-sm text-muted-foreground">
                Lines reviewed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">50%</div>
              <div className="text-sm text-muted-foreground">
                Faster reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code snippet preview */}
      <div className="relative mx-auto max-w-5xl px-4 pb-20">
        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-muted-foreground">
              Pull Request #123
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AI</span>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    <strong>Potential security issue:</strong> This function
                    appears to be vulnerable to SQL injection. Consider using
                    parameterized queries instead.
                  </p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  CodeReverb AI Review • 2 minutes ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
