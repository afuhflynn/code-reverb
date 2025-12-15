/**
 * Hooks to handle the api-client and api interface communication.
 */

import { api } from "@/lib/api-client";
import { Repo } from "@/lib/generated/prisma/client";
import {
  getDailyContributions,
  getDashboardStats,
  getMonthlyActivity,
} from "@/lib/github-utils/actions";
import { connectRepo, fetchRespositories } from "@/lib/repository/actions";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ALL } from "node:dns";
import { toast } from "sonner";

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

interface RepoWithConnected extends Repo {
  isConnected: boolean;
}

export function useConnectRepository() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationKey: ["create-webhook", "connect-repo"],
    mutationFn: async ({
      owner,
      repo,
      githubId,
    }: {
      owner: string;
      repo: string;
      githubId: number;
    }) => await connectRepo(owner, repo, githubId),
    onMutate(variables) {
      variables.githubId;
      // temporarily update the ui (Optimistic ui)
      queryClient.setQueryData(["repositories"], (prev: RepoWithConnected[]) =>
        prev.map((repo) => {
          if (repo.githubId === BigInt(variables.githubId))
            repo.isConnected = true;
          return repo;
        })
      );
    },
    onSuccess: () => {
      toast.success("Repository connected succesfully :)");
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
    onError: (error, variables) => {
      console.error(error);
      toast.error("Failed to connect repository :(");
      // Undo the optimistic ui
      queryClient.setQueryData(["repositories"], (prev: RepoWithConnected[]) =>
        prev.map((repo) => {
          if (repo.githubId === BigInt(variables.githubId))
            repo.isConnected = true;
          return repo;
        })
      );
    },
  });
}
