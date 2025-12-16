import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CodeReverb",
  description:
    "Learn about CodeReverb, an AI-powered code review platform that helps development teams deliver higher quality code faster through intelligent automated analysis.",
  keywords: [
    "about CodeReverb",
    "AI code review platform",
    "automated code analysis",
    "GitHub integration",
    "code quality tools",
    "developer productivity",
  ],
  openGraph: {
    title: "About CodeReverb - AI-Powered Code Review Platform",
    description:
      "Learn about CodeReverb, an AI-powered code review platform that helps development teams deliver higher quality code faster through intelligent automated analysis.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About CodeReverb - AI-Powered Code Review Platform",
    description:
      "Learn about CodeReverb, an AI-powered code review platform that helps development teams deliver higher quality code faster through intelligent automated analysis.",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About CodeReverb</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          CodeReverb is an AI-powered code review platform that helps
          development teams deliver higher quality code faster.
        </p>

        <h2>Our Mission</h2>
        <p>
          To revolutionize code review processes by leveraging artificial
          intelligence to provide instant, intelligent feedback on pull
          requests, helping developers catch issues early and maintain high code
          quality standards.
        </p>

        <h2>What We Do</h2>
        <ul>
          <li>
            <strong>Automated Code Analysis:</strong> Our AI analyzes code
            changes for potential bugs, security vulnerabilities, and best
            practice violations.
          </li>
          <li>
            <strong>Customizable Personas:</strong> Create AI reviewers with
            different personalities and expertise areas tailored to your team's
            needs.
          </li>
          <li>
            <strong>GitHub Integration:</strong> Seamlessly integrates with
            GitHub repositories to provide inline comments and review
            suggestions.
          </li>
          <li>
            <strong>Team Analytics:</strong> Track review metrics and team
            performance to continuously improve your development process.
          </li>
        </ul>

        <h2>Our Technology</h2>
        <p>
          CodeReverb uses state-of-the-art machine learning models, including
          Google's Gemini and OpenAI's GPT series, combined with specialized
          code analysis techniques. Our platform is built on modern web
          technologies and designed for scalability.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? We'd love to hear from you. Reach out to
          us at hello@CodeReverb.dev or visit our contact page.
        </p>
      </div>
    </div>
  );
}
