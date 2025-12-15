/**
 * Hooks to handle the api-client and api interface communication.
 */

import { api } from "@/lib/api-client";
import {
  getDailyContributions,
  getDashboardStats,
  getMonthlyActivity,
} from "@/lib/github-utils/actions";
import { useQuery } from "@tanstack/react-query";

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
