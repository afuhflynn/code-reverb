import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://code-reverb.dev"),
  title: {
    default: "Code-Reverb - AI-Powered Code Review Platform",
    template: "%s | Code-Reverb",
  },
  description:
    "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions using Google Gemini and OpenAI.",
  keywords: [
    "code review",
    "AI code analysis",
    "GitHub integration",
    "automated code review",
    "pull request analysis",
    "code quality",
    "developer tools",
    "Google Gemini",
    "OpenAI",
    "software development",
  ],
  authors: [{ name: "Code-Reverb Team" }],
  creator: "Code-Reverb",
  publisher: "Code-Reverb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://code-reverb.dev",
    title: "Code-Reverb - AI-Powered Code Review Platform",
    description:
      "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions.",
    siteName: "Code-Reverb",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code-Reverb - AI-Powered Code Review Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code-Reverb - AI-Powered Code Review Platform",
    description:
      "Revolutionize your code reviews with AI-powered analysis. Get intelligent feedback on pull requests, automated bug detection, and personalized code suggestions.",
    images: ["/og-image.png"],
    creator: "@codereverb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://code-reverb.dev",
  },
  category: "developer tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                theme="system"
              />
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
