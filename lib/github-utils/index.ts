import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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
    user(login:&username) {
      contributionCollection {
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

    return response.user.contributionCollection.contributionCalendar;
  } catch (error) {
    console.error(error);
    return null;
  }
}
