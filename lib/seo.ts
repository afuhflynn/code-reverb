import type { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function generateSEO(props: SEOProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = "/og-image.png",
    url,
    type = "website",
    noIndex = false,
  } = props;

  const baseKeywords = [
    "code review",
    "AI code analysis",
    "GitHub integration",
    "automated code review",
    "code quality",
    "developer tools",
  ];

  const allKeywords = [...baseKeywords, ...keywords];

  return {
    title: title ? `${title} | Code-Reverb` : undefined,
    description,
    keywords: allKeywords,
    openGraph: {
      title: title
        ? `${title} | Code-Reverb`
        : "Code-Reverb - AI-Powered Code Review Platform",
      description:
        description ||
        "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions.",
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
            ? `${title} | Code-Reverb`
            : "Code-Reverb - AI-Powered Code Review Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title
        ? `${title} | Code-Reverb`
        : "Code-Reverb - AI-Powered Code Review Platform",
      description:
        description ||
        "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions.",
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: "Code-Reverb - AI-Powered Code Review Platform",
    description:
      "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions using Google Gemini and OpenAI.",
  },
  about: {
    title: "About Code-Reverb",
    description:
      "Learn about Code-Reverb, an AI-powered code review platform that helps development teams deliver higher quality code faster through intelligent automated analysis.",
    keywords: [
      "about Code-Reverb",
      "AI code review platform",
      "automated code analysis",
    ],
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with the Code-Reverb team. Contact us for support, business inquiries, technical questions, or partnership opportunities.",
    keywords: ["contact Code-Reverb", "support", "technical support"],
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about Code-Reverb's AI-powered code review platform. Learn how it works, pricing, security, and supported languages.",
    keywords: ["FAQ", "frequently asked questions", "Code-Reverb help"],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Read Code-Reverb's privacy policy to understand how we collect, use, and protect your personal information when using our AI-powered code review platform.",
    keywords: ["privacy policy", "data protection", "GDPR compliance"],
  },
  terms: {
    title: "Terms of Service",
    description:
      "Read Code-Reverb's terms of service agreement. Understand the rules, user responsibilities, and legal terms for using our AI-powered code review platform.",
    keywords: ["terms of service", "terms and conditions", "user agreement"],
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Learn about how Code-Reverb uses cookies to improve your experience on our AI-powered code review platform. Understand our cookie policy and your privacy rights.",
    keywords: ["cookie policy", "cookies", "privacy"],
  },
  auth: {
    title: "Sign In",
    description:
      "Sign in to Code-Reverb with your GitHub account to access AI-powered code review tools and analytics.",
    noIndex: true,
  },
  dashboard: {
    title: "Dashboard",
    description:
      "Access your Code-Reverb dashboard to manage repositories, view analytics, and monitor AI-powered code reviews.",
    noIndex: true,
  },
} as const;
