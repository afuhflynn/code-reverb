"use server";

import { fetchUserGithubContributions, getGithubToken } from "..";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
import { prisma } from "@/lib/prisma";
import { months } from "@/constants";

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

    // TODO: Fetch the total connected repos for the user.
    const totalRepos = 60; // NOTE: Dummy data

    // Fetch user contribution stats
    const calendar = await fetchUserGithubContributions(user.login, token);
    const totalCommits = calendar?.totalContributions || 0;

    // Count total prs from (db or github)
    const { data: PRs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = PRs.total_count;

    // TODO: Count ai reviews from the db
    const totalReviews = 44;

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

    // TODO: REVIEWS'S REAL DATA
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // Generate random reviews over the past 6 months
      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();
    reviews.forEach((review) => {
      const monthKey = months[review.createdAt.getMonth()];
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
  };
}

export async function postReviewComment(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  review: string
) {
  const octokit = new Octokit({ auth: token });
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `## Code review by CodeReverb\n\n${review}\n\n---\n*Powered by CodeReverb [Try out CodeReverb](https://codereverb.dev)*`,
  });
}
