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
  perPage: number = 10
) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page,
  });

  return data;
};
