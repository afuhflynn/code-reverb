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
