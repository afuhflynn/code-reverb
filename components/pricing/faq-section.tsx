import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately, and we'll prorate any charges or credits.",
  },
  {
    question: "What happens if I exceed my review limits?",
    answer:
      "If you reach your monthly review limit, we'll notify you and give you the option to upgrade your plan. Reviews will continue, but additional charges may apply based on overage rates.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Annual plans come with a 20% discount compared to monthly billing. This helps you save money while committing to your team's growth.",
  },
  {
    question: "Can I add more team members to my plan?",
    answer:
      "Absolutely. You can add team members at any time. Additional members are billed at a prorated rate based on your current billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers.",
  },
  {
    question: "Is there a free trial for all plans?",
    answer:
      "Yes, all paid plans include a 14-day free trial. During the trial, you have full access to all features of your chosen plan.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Free plans get community support. Paid plans include email support, with Professional and Enterprise plans getting priority support and phone assistance.",
  },
  {
    question: "Can I export my data if I cancel?",
    answer:
      "Yes, you can export all your review history, analytics, and settings at any time. We also provide data migration assistance for Enterprise customers.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, we'll refund your payment in full.",
  },
  {
    question: "What integrations do you support?",
    answer:
      "We integrate with GitHub, GitLab, and Bitbucket. Professional and Enterprise plans include webhooks, APIs, and custom integrations.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about CodeReverb pricing and plans.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-center">Pricing & Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
