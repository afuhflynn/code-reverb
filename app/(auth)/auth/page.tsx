"use client";

// Note: Metadata is handled by the auth layout
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";
import { MainLoader } from "@/components/loaders/main-loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { searchParamsSchema } from "@/nuqs";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params] = useQueryStates(searchParamsSchema);
  const { redirect } = params;

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn.social({
        provider: "github",
        fetchOptions: {
          onSuccess(context) {
            console.log("Sign in successful:", context);
            toast.success("Successfully signed in!");
          },
          onError(err) {
            console.error("Sign in failed:", err);
            setError("Sign in failed. Please try again.");
            toast.error("Sign in failed. Please try again.");
          },
        },
        callbackURL: redirect || "/app",
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
        {/* Left: Narrative + value */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
              AI code review for GitHub teams
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ship safer pull requests with an AI reviewer that lives in GitHub.
            </h1>
          </div>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            CodeReverb watches your PRs, runs deep context-aware analysis over
            your codebase, and leaves precise inline comments—so humans can
            focus on decisions, not boilerplate reviews.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <p>
                <span className="font-medium">
                  Automatic first-pass reviews.
                </span>{" "}
                Every new PR gets a structured review with severity and
                confidence.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <p>
                <span className="font-medium">Inline GitHub comments.</span> All
                feedback shows up where your team already lives: in the PR
                conversation.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <p>
                <span className="font-medium">Persona-based reviewers.</span>{" "}
                Tune CodeReverb for security, performance, or documentation
                focus.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5">
              <FaGithub className="h-3 w-3" />
              <span>GitHub OAuth only</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>MIT-licensed core</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>Read-only PR access for reviews</span>
            </span>
          </div>
        </div>

        {/* Right: Sign-in card */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-sm border-border/80">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">
                Sign in with GitHub
              </CardTitle>
              <CardDescription>
                Connect your GitHub account to let CodeReverb review your pull
                requests and surface insights in your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-destructive text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSignIn}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <MainLoader />
                ) : (
                  <>
                    <FaGithub className="mr-2 h-5 w-5" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground leading-relaxed">
                We use GitHub only to read repository metadata and pull requests
                needed for reviews. CodeReverb does{" "}
                <span className="font-semibold">not</span> push commits or merge
                branches on your behalf.
              </p>

              {redirect && (
                <p className="text-[11px] text-muted-foreground text-center">
                  After signing in, you&apos;ll be redirected to:
                  <span className="ml-1 font-mono break-all">{redirect}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
