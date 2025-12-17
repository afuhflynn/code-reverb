import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechFlow Inc.",
    avatar: "/avatars/sarah.jpg",
    content:
      "CodeReverb has transformed our code review process. We catch issues 3x faster and our code quality has never been better. The AI suggestions are incredibly accurate.",
    metrics: ["50% faster reviews", "90% fewer bugs"],
  },
  {
    name: "Marcus Rodriguez",
    role: "Senior Developer",
    company: "StartupXYZ",
    avatar: "/avatars/marcus.jpg",
    content:
      "As a small team, we couldn't afford dedicated code reviewers. CodeReverb gives us enterprise-level code analysis at a fraction of the cost. Game changer!",
    metrics: ["From 0 to 100% coverage", "$50k annual savings"],
  },
  {
    name: "Emma Thompson",
    role: "CTO",
    company: "DataDriven Co.",
    avatar: "/avatars/emma.jpg",
    content:
      "The custom personas feature allows us to maintain our coding standards across different projects. Integration was seamless and the support team is excellent.",
    metrics: ["15 teams onboarded", "99.9% satisfaction"],
  },
  {
    name: "David Kim",
    role: "Lead Engineer",
    company: "FinTech Solutions",
    avatar: "/avatars/david.jpg",
    content:
      "Security was our biggest concern, but CodeReverb's analysis caught vulnerabilities we would have missed. Essential for our compliance requirements.",
    metrics: ["Zero security incidents", "SOC2 compliant"],
  },
];

const companies = [
  { name: "TechFlow", logo: "/logos/techflow.svg" },
  { name: "StartupXYZ", logo: "/logos/startupxyz.svg" },
  { name: "DataDriven", logo: "/logos/datadriven.svg" },
  { name: "FinTech", logo: "/logos/fintech.svg" },
  { name: "CloudCorp", logo: "/logos/cloudcorp.svg" },
  { name: "DevTools", logo: "/logos/devtools.svg" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by developers worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of development teams who have improved their code
            quality with CodeReverb.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.company}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {testimonial.role}
                    </p>
                    <blockquote className="text-foreground italic mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex flex-wrap gap-2">
                      {testimonial.metrics.map((metric) => (
                        <Badge
                          key={metric}
                          variant="outline"
                          className="text-xs"
                        >
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company) => (
              <div key={company.name} className="h-8 flex items-center">
                <span className="text-lg font-semibold text-muted-foreground">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-foreground">10,000+</div>
            <div className="text-sm text-muted-foreground">Developers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">50M+</div>
            <div className="text-sm text-muted-foreground">Lines reviewed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
