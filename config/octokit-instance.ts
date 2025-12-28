import { App } from "octokit";

/**
 * Creates an authenticated Octokit instance for a specific installation
 * @param installationId - GitHub App installation ID
 * @returns Authenticated Octokit instance
 */
export async function getOctokitForInstallation(installationId: number) {
  const app = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
  });

  // Get installation access token
  const octokit = await app.getInstallationOctokit(installationId);

  return octokit;
}
