interface DailyActivity {
  date: string;
  count: number;
}

interface MultiActivityData {
  date: string;
  commits: number;
  pullRequests: number;
  aiReviews: number;
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string | Date;
      color: string;
    }[];
  }[];
}
interface ContributionData {
  user: {
    contributionCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}
