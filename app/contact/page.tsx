import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Code-Reverb",
  description:
    "Get in touch with the Code-Reverb team. Contact us for support, business inquiries, technical questions, or partnership opportunities.",
  keywords: [
    "contact Code-Reverb",
    "support",
    "technical support",
    "business inquiries",
    "partnerships",
    "customer service",
  ],
  openGraph: {
    title: "Contact Us - Code-Reverb",
    description:
      "Get in touch with the Code-Reverb team. Contact us for support, business inquiries, technical questions, or partnership opportunities.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - Code-Reverb",
    description:
      "Get in touch with the Code-Reverb team. Contact us for support, business inquiries, technical questions, or partnership opportunities.",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          We'd love to hear from you! Whether you have questions, feedback, or
          need support, we're here to help.
        </p>

        <h2>Get in Touch</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3>General Inquiries</h3>
            <p>Email: hello@code-reverb.com</p>
            <p>Response time: Within 24 hours</p>
          </div>
          <div>
            <h3>Technical Support</h3>
            <p>Email: support@code-reverb.com</p>
            <p>Response time: Within 4 hours</p>
          </div>
          <div>
            <h3>Business & Partnerships</h3>
            <p>Email: business@code-reverb.com</p>
            <p>Response time: Within 48 hours</p>
          </div>
          <div>
            <h3>Security & Privacy</h3>
            <p>Email: security@code-reverb.com</p>
            <p>Response time: Within 12 hours</p>
          </div>
        </div>

        <h2>Office Hours</h2>
        <p>
          Our support team is available Monday through Friday, 9 AM to 6 PM EST.
          We aim to respond to all inquiries within the specified timeframes.
        </p>

        <h2>Community</h2>
        <p>
          Join our community discussions on GitHub or follow us for updates and
          announcements.
        </p>
      </div>
    </div>
  );
}
