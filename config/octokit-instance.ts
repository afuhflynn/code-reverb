import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";

/**
 * Creates an authenticated Octokit instance for a specific installation
 * @param installationId - GitHub App installation ID
 * @returns Authenticated Octokit instance
 */

export function getOctokitForInstallation(installationId: number) {
  if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
    throw new Error("GITHUB_APP_ID or GITHUB_PRIVATE_KEY missing");
  }

  // Octokit will exchange the app JWT for an installation access token automatically
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: Number(process.env.GITHUB_APP_ID),
      privateKey: process.env.GITHUB_PRIVATE_KEY,
      installationId,
    },
  });

  return octokit;
}
