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

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  githubUrl: string;
  username: string;
  showEmail: boolean;
  showLocation: boolean;
  image?: string;
}

type SettingsTab =
  | "profile"
  | "notifications"
  | "account"
  | "security"
  | "ai"
  | "privacy"
  | "appearance"
  | "organization"
  | "repositories";
