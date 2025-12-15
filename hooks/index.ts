/**
 * Hooks to handle the api-client and api interface communication.
 */

import { api } from "@/lib/api-client";
import {
  getDailyContributions,
  getDashboardStats,
  getMonthlyActivity,
} from "@/lib/github-utils/actions";
import { fetchRespositories } from "@/lib/repository/actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ALL } from "node:dns";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: api.queries.users.getProfile,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => api.queries.users.getById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["code-reverb", "users"],
    queryFn: api.queries.users.getMany,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}

// dashboard stats

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useMultiAtivityChart() {
  return useQuery({
    queryKey: ["monthly-activity"],
    queryFn: getMonthlyActivity,
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}
export function useDailyActivityChart() {
  return useQuery({
    queryKey: ["daily-contributions"],
    queryFn: getDailyContributions,
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  });
}

// repositories

export function useRepositories() {
  return useInfiniteQuery({
    queryKey: ["repositories"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRespositories(pageParam, 10);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}
