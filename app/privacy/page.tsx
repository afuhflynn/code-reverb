import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Code-Reverb",
  description:
    "Read Code-Reverb's privacy policy to understand how we collect, use, and protect your personal information when using our AI-powered code review platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "personal information",
    "data security",
    "Code-Reverb privacy",
  ],
  openGraph: {
    title: "Privacy Policy - Code-Reverb",
    description:
      "Read Code-Reverb's privacy policy to understand how we collect, use, and protect your personal information when using our AI-powered code review platform.",
    type: "website",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - Code-Reverb",
    description:
      "Read Code-Reverb's privacy policy to understand how we collect, use, and protect your personal information when using our AI-powered code review platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, use our services, or contact us for support.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Communicate with you about products, services, and promotions</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. You may also object to or restrict certain processing of
          your information.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at privacy@code-reverb.dev.
        </p>
      </div>
    </div>
  );
}
