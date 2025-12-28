"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConnectGitHubPage() {
  const router = useRouter();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallApp = async () => {
    const installUrl = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL;
    console.log({ installUrl });
    if (installUrl) {
      setIsInstalling(true);
      window.open(installUrl, "_self");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <Card className="shadow-sm border-border/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Connect CodeReverb to your GitHub repositories
            </CardTitle>
            <CardDescription className="text-base">
              To start reviewing pull requests, install the GitHub App to grant
              read-only access to your repos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">What you'll get:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>
                    <span className="font-medium">Automated PR reviews.</span>{" "}
                    AI-powered analysis of code changes with structured
                    feedback.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>
                    <span className="font-medium">Inline GitHub comments.</span>{" "}
                    Reviews appear directly in PR conversations where your team
                    works.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>
                    <span className="font-medium">Analytics dashboard.</span>{" "}
                    Track review metrics and team performance insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Permissions & Security:</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  • Read-only access to repository metadata and pull request
                  content
                </p>
                <p>
                  • CodeReverb analyzes changes but never modifies or pushes
                  code
                </p>
                <p>
                  • All data is encrypted and handled according to our privacy
                  policy
                </p>
                <p>
                  • MIT-licensed core ensures transparency and community
                  oversight
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleInstallApp}
                className="w-full"
                size="lg"
                disabled={isInstalling}
              >
                <FaGithub className="mr-2 h-5 w-5" />
                {isInstalling
                  ? "Opening GitHub..."
                  : "Install CodeReverb GitHub App"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You can connect repositories later from your dashboard settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
