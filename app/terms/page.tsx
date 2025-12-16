import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CodeReverb",
  description:
    "Read CodeReverb's terms of service agreement. Understand the rules, user responsibilities, and legal terms for using our AI-powered code review platform.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "legal terms",
    "CodeReverb terms",
    "service agreement",
  ],
  openGraph: {
    title: "Terms of Service - CodeReverb",
    description:
      "Read CodeReverb's terms of service agreement. Understand the rules, user responsibilities, and legal terms for using our AI-powered code review platform.",
    type: "website",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - CodeReverb",
    description:
      "Read CodeReverb's terms of service agreement. Understand the rules, user responsibilities, and legal terms for using our AI-powered code review platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using CodeReverb, you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on CodeReverb's website for personal, non-commercial
          transitory viewing only.
        </p>

        <h2>3. Service Description</h2>
        <p>
          CodeReverb provides AI-powered code review services for GitHub
          repositories. We analyze pull requests and provide automated feedback
          using machine learning models.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>Users are responsible for:</p>
        <ul>
          <li>Maintaining the security of their GitHub accounts</li>
          <li>Ensuring compliance with applicable laws</li>
          <li>Not using the service for malicious purposes</li>
        </ul>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall CodeReverb or its suppliers be liable for any
          damages arising out of the use or inability to use the materials on
          our platform.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend access to our service immediately, without
          prior notice or liability, for any reason whatsoever.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These terms shall be interpreted and governed by the laws of the
          jurisdiction in which CodeReverb operates.
        </p>
      </div>
    </div>
  );
}
