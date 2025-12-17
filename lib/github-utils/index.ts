"use server";

import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            contributionCount: number;
            date: string;
            color: string;
          }[];
        }[];
      };
    };
  };
}

/**
 * @description: This method gets user's github access token
 * @returns: [string] - Github AccessToken
 */

export async function getGithubToken() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "github" },
  });

  if (!account?.accessToken) throw new Error("No github accecss token found!");

  return account.accessToken;
}

/**
 * @description: This methods fetches a github user contribution for creating their hit map (contribution graph)
 * @param: [username, accessToken] - (username: string, accessToken: string)
 * @returns: [Github Contribution Calendar] - (contributionCalendar: ContributionCalendar) | null
 */

export async function fetchUserGithubContributions(
  username: string,
  accessToken: string
) {
  const octokit = new Octokit({ auth: accessToken });

  const query = `
  query($username:String!) {
    user(login:$username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response: ContributionData = await octokit.graphql(query, {
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getRepositories = async (
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  status: string = "all"
) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility:
      status === "all" ? "all" : status === "private" ? "private" : "public",
    per_page: perPage,
    page,
  });

  if (search) {
    // Only filter if there's a search term
    const filtered = data.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.full_name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.owner.login.toLowerCase().includes(search.toLowerCase())
    );
    return filtered;
  }

  // No search term → return all repos on the page
  return data;
};

export const createWebHook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const webHookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });

  const existingHook = hooks.find((hook) => hook.config.url === webHookUrl);

  if (existingHook) {
    return existingHook;
  }

  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webHookUrl,
      content_type: "json",
    },
    events: ["pull_request"],
  });

  return data;
};

export async function deleteWebHook(owner: string, repo: string) {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  try {
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const webHookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/github`;

    const existingHook = hooks.find((hook) => hook.config.url === webHookUrl);
    if (!existingHook) {
      return false;
    }

    const hookId = existingHook.id;
    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: hookId,
    });
    return true;
  } catch (error) {
    console.error("Failed to delete webhook:", error);
    return false;
  }
}

export async function getRepoFileContents(
  accessToken: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  if (!Array.isArray(data)) {
    // It's a file
    if (data.type === "file" && data.content) {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: { path: string; content: string }[] = [];

  for (const item of data) {
    if (item.type === "file") {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: item.path,
      });

      if (
        !Array.isArray(fileData) &&
        fileData.type === "file" &&
        fileData.content
      ) {
        // Filter out non-code files if needed (images, etc.)
        // Include only files that contain text
        if (
          !item.path.match(
            /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|bmp|tiff|pdf|ttf|otf|woff|woff2|eot|zip|tar|gz|rar|7z|exe|dll|so|dylib|bin|mp3|mp4|wav|avi|mov|mkv|webm|lock|min\.js|min\.css|bundle\.js|chunk\.js|map)$/i
          ) &&
          !item.path.includes("node_modules/") &&
          !item.path.includes(".git/") &&
          !item.path.includes("dist/") &&
          !item.path.includes("build/") &&
          !item.path.includes("coverage/")
        ) {
          files.push({
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    } else if (item.type === "dir") {
      const subFiles = await getRepoFileContents(
        accessToken,
        owner,
        repo,
        item.path
      );

      files = files.concat(subFiles);
    }
  }

  return files;
}
