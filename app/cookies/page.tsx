import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Code-Reverb",
  description:
    "Learn about how Code-Reverb uses cookies to improve your experience on our AI-powered code review platform. Understand our cookie policy and your privacy rights.",
  keywords: [
    "cookie policy",
    "cookies",
    "privacy",
    "data collection",
    "web analytics",
    "Code-Reverb cookies",
  ],
  openGraph: {
    title: "Cookie Policy - Code-Reverb",
    description:
      "Learn about how Code-Reverb uses cookies to improve your experience on our AI-powered code review platform. Understand our cookie policy and your privacy rights.",
    type: "website",
    url: "/cookies",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy - Code-Reverb",
    description:
      "Learn about how Code-Reverb uses cookies to improve your experience on our AI-powered code review platform. Understand our cookie policy and your privacy rights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your computer or
          mobile device when you visit our website.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Analyze site traffic and usage</li>
          <li>Provide personalized content and features</li>
          <li>Ensure the security of our services</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>These cookies are necessary for the website to function properly.</p>

        <h3>Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our
          website.
        </p>

        <h3>Functional Cookies</h3>
        <p>These cookies enable enhanced functionality and personalization.</p>

        <h2>4. Managing Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Most web browsers
          allow you to control cookies through their settings.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us
          at cookies@code-reverb.dev.
        </p>
      </div>
    </div>
  );
}
