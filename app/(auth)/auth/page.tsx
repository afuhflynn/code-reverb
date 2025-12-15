"use client";

import { useState } from "react";

// Note: Metadata is handled by the auth layout

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa6";
import { MainLoader } from "@/components/loaders/main-loader";
import { useQueryStates } from "nuqs";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to Code-Reverb
          </CardTitle>
          <CardDescription>
            Sign in with GitHub to start reviewing code with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
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
                <span>Sign in with GitHub</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
