import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - CodeReverb",
  description:
    "Find answers to common questions about CodeReverb's AI-powered code review platform. Learn how it works, pricing, security, and supported languages.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "CodeReverb help",
    "code review questions",
    "AI code analysis FAQ",
    "GitHub integration questions",
    "pricing FAQ",
    "security FAQ",
  ],
  openGraph: {
    title: "Frequently Asked Questions - CodeReverb",
    description:
      "Find answers to common questions about CodeReverb's AI-powered code review platform. Learn how it works, pricing, security, and supported languages.",
    type: "website",
    url: "/faq",
  },
  twitter: {
    card: "summary",
    title: "Frequently Asked Questions - CodeReverb",
    description:
      "Find answers to common questions about CodeReverb's AI-powered code review platform. Learn how it works, pricing, security, and supported languages.",
  },
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="space-y-6">
          <div>
            <h2>What is CodeReverb?</h2>
            <p>
              CodeReverb is an AI-powered code review platform that
              automatically analyzes pull requests on GitHub, providing
              intelligent feedback and suggestions to improve code quality.
            </p>
          </div>

          <div>
            <h2>How does it work?</h2>
            <p>
              When you connect a GitHub repository, CodeReverb monitors pull
              requests and uses AI models to analyze code changes. It provides
              inline comments directly on GitHub with suggestions for
              improvements, bug fixes, and best practices.
            </p>
          </div>

          <div>
            <h2>What programming languages does it support?</h2>
            <p>
              CodeReverb supports all major programming languages including
              JavaScript, TypeScript, Python, Java, C++, Go, Rust, and many
              others. Our AI models are trained on diverse codebases.
            </p>
          </div>

          <div>
            <h2>Is my code secure?</h2>
            <p>
              Yes, we take security seriously. Code is analyzed in isolated
              environments and never stored permanently. We use
              industry-standard encryption and follow security best practices.
            </p>
          </div>

          <div>
            <h2>Can I customize the AI reviewer?</h2>
            <p>
              Absolutely! You can create custom "personas" with different
              personalities and expertise areas. For example, you might have a
              "strict code reviewer" for production code or a
              "beginner-friendly" reviewer for junior developers.
            </p>
          </div>

          <div>
            <h2>How much does it cost?</h2>
            <p>
              We offer a free tier for small teams and repositories. Premium
              plans start at $29/month for larger teams with advanced features.
              Check our pricing page for current plans.
            </p>
          </div>

          <div>
            <h2>Can I integrate it with my existing workflow?</h2>
            <p>
              Yes! CodeReverb integrates seamlessly with GitHub. You can
              configure it to run on specific branches, set up custom rules, and
              integrate with your CI/CD pipelines.
            </p>
          </div>

          <div>
            <h2>What if I disagree with a suggestion?</h2>
            <p>
              AI suggestions are just that - suggestions. You can accept,
              reject, or modify them as needed. The AI learns from feedback to
              improve over time.
            </p>
          </div>

          <div>
            <h2>Do you support GitLab or Bitbucket?</h2>
            <p>
              Currently, we focus on GitHub integration. Support for GitLab and
              Bitbucket is planned for future releases.
            </p>
          </div>

          <div>
            <h2>How do I get started?</h2>
            <p>
              Simply sign up with your GitHub account, connect your
              repositories, and start receiving AI-powered code reviews on your
              next pull request!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
