"use server";

import { fetchUserGithubContributions, getGithubToken } from "..";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
import { prisma } from "@/lib/prisma";
import { months } from "@/constants";

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
    const totalRepos = 30; // NOTE: Dummy data

    // Fetch user contribution stats
    const calendar = await fetchUserGithubContributions(user.login, token);
    const totalCmmits = calendar?.totalContributions || 0;

    // Count total prs from (db or github)
    const { data: PRs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPRs = PRs.total_count;

    // TODO: Count ai reviews from the db
    const totalReviews = 44;

    return {
      totalCmmits,
      totalPRs,
      totalReviews,
      totalRepos,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats: ", error);
    return {
      totalCmmits: 0,
      totalPRs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
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

    // Last 3 months data
    const now = new Date();
    for (let i = 2; i >= 0; i--) {
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

    // Fetch reviews from database for last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // TODO: REVIEWS'S REAL DATA
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // Generate random reviews over the past 3 months
      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 3 months
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
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.error("Error fethcing user monthly activity", error);
  }
}
