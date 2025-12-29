"use server";

import { fetchUserGithubContributions, getGithubToken } from "..";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { App, Octokit } from "octokit";
import { prisma } from "@/lib/prisma";
import { months } from "@/constants";
import { getOctokitForInstallation } from "@/config/octokit-instance";

interface DailyActivity {
  date: string;
  count: number;
}

/**
 * @description: This method gets user's dashboard stats
 */
export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    // Get user's github username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const userRepos = await octokit.rest.repos.listForUser({
      username: user.login,
    });

    const totalRepos = userRepos.data.length;
    // Fetch user contribution stats
    const calendar = await fetchUserGithubContributions(user.login, token);
    const totalCommits = calendar?.totalContributions || 0;

    // Count total prs from (db or github)
    const { data: PRs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = PRs.total_count;

    const totalReviews = await prisma.review.count({
      where: {
        userId: session.user.id,
      },
    });

    return {
      totalCommits,
      totalPRs,
      totalReviews,
      totalRepos,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats: ", error);
    return {
      totalCommits: 0,
      totalPRs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
}

/**
 * @description: This method gets user's daily contribution data for the activity chart
 */
export async function getDailyContributions(): Promise<DailyActivity[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const token = await getGithubToken();

    // Get user's github username
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // Fetch user contribution stats
    const calendar = await fetchUserGithubContributions(user.login, token);

    if (!calendar) {
      return [];
    }

    // Flatten the calendar into daily activities
    const dailyActivities: DailyActivity[] = [];
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        dailyActivities.push({
          date: day.date as string,
          count: day.contributionCount,
        });
      });
    });

    return dailyActivities;
  } catch (error) {
    console.error("Error fetching daily contributions:", error);
    return [];
  }
}

/**
 * @description: This method gets user's monthly activity on the app
 */

export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    // Get user's github username
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // Fetch user contribution stats
    const calendar = await fetchUserGithubContributions(user.login, token);

    if (!calendar) {
      return [];
    }

    const monthlyData: {
      [key: string]: { commits: number; prs: number; reviews: number };
    } = {};

    // Last 6 months data
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const monthKey = months[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    // Fill in the empty monthlyData map (object) with fetched data
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = months[date.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    // Fetch reviews from database for last 6 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: threeMonthsAgo,
        },
      },
    });

    reviews.forEach((review) => {
      const monthKey = months[new Date(review.createdAt).getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        threeMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = months[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((name) => ({
      date: name,
      commits: monthlyData[name].commits,
      pullRequests: monthlyData[name].prs,
      aiReviews: monthlyData[name].reviews,
    }));
  } catch (error) {
    console.error("Error fetching user monthly activity", error);
    return [];
  }
}

export async function getPullRequestDiff(
  token: string,
  owner: string,
  repo: string,
  prNumber: number
) {
  const octokit = new Octokit({ auth: token });

  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  return {
    diff: diff as unknown as string,
    title: pr.title,
    description: pr.body || "",
    author: pr.user.name,
  };
}

export async function getGithubInstallationId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");

  const installation = await prisma.installation.findFirst({
    where: { userId: session.user.id },
    select: {
      installationId: true,
    },
  });

  if (!installation) throw new Error("No github accecss token found!");

  return installation.installationId;
}

export async function postReviewComment(
  installationId: number,
  owner: string,
  repo: string,
  prNumber: number,
  review: string
) {
  const octokit = getOctokitForInstallation(installationId);
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `## Code review by CodeReverb\n\n${review}\n\n---\n*Powered by CodeReverb [Try out CodeReverb](https://codereverb.dev)*`,
  });
}

export async function postSummaryAsUser(
  owner: string,
  repo: string,
  prNumber: number,
  summary: string
) {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: summary,
  });
}
