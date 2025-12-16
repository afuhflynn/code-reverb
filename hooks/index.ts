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
  useQueryClient,
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
    staleTime: Infinity, // never stale
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
    staleTime: Infinity, // never stale
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
    staleTime: Infinity, // never stale
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
    staleTime: Infinity, // never stale
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
        }),
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
        }),
      );
    },
  });
}

// Settings hooks
export function useSettingsProfile() {
  return useQuery({
    queryKey: ["settings-profile"],
    queryFn: api.queries.settings.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}

export function useSettingsNotifications() {
  return useQuery({
    queryKey: ["settings-notifications"],
    queryFn: api.queries.settings.getNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-notifications"] });
      toast.success("Notifications updated successfully");
    },
    onError: () => {
      toast.error("Failed to update notifications");
    },
  });
}

export function useSettingsAI() {
  return useQuery({
    queryKey: ["settings-ai"],
    queryFn: api.queries.settings.getAI,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-ai"] });
      toast.success("AI settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update AI settings");
    },
  });
}

export function useSettingsPrivacy() {
  return useQuery({
    queryKey: ["settings-privacy"],
    queryFn: api.queries.settings.getPrivacy,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsPrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updatePrivacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-privacy"] });
      toast.success("Privacy settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update privacy settings");
    },
  });
}

export function useSettingsAppearance() {
  return useQuery({
    queryKey: ["settings-appearance"],
    queryFn: api.queries.settings.getAppearance,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsAppearance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateAppearance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-appearance"] });
      toast.success("Appearance settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update appearance settings");
    },
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: api.queries.settings.getApiKeys,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key created successfully");
    },
    onError: () => {
      toast.error("Failed to create API key");
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.mutations.settings.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete API key");
    },
  });
}

export function useOrganizationSettings() {
  return useQuery({
    queryKey: ["settings-organization"],
    queryFn: api.queries.settings.getOrganization,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-organization"] });
      toast.success("Organization updated successfully");
    },
    onError: () => {
      toast.error("Failed to update organization");
    },
  });
}

export function useSettingsBilling() {
  return useQuery({
    queryKey: ["settings-billing"],
    queryFn: api.queries.settings.getBilling,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettingsBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.updateBilling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-billing"] });
      toast.success("Billing settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update billing settings");
    },
  });
}

export function useSettingsSessions() {
  return useQuery({
    queryKey: ["settings-sessions"],
    queryFn: api.queries.settings.getSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: api.mutations.settings.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to change password");
    },
  });
}

export function useSetup2FA() {
  return useMutation({
    mutationFn: api.mutations.settings.setup2FA,
    onSuccess: () => {
      toast.success("2FA setup initiated");
    },
    onError: () => {
      toast.error("Failed to setup 2FA");
    },
  });
}

export function useVerify2FA() {
  return useMutation({
    mutationFn: api.mutations.settings.verify2FA,
    onSuccess: () => {
      toast.success("2FA enabled successfully");
    },
    onError: () => {
      toast.error("Failed to verify 2FA");
    },
  });
}

export function useDisable2FA() {
  return useMutation({
    mutationFn: api.mutations.settings.disable2FA,
    onSuccess: () => {
      toast.success("2FA disabled successfully");
    },
    onError: () => {
      toast.error("Failed to disable 2FA");
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      api.mutations.settings.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-sessions"] });
      toast.success("Session revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke session");
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.mutations.settings.revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-sessions"] });
      toast.success("All sessions revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke all sessions");
    },
  });
}

// Reviews hooks
export function useReviews(filters?: {
  status?: string;
  repository?: string;
  persona?: string;
  qualityScore?: string;
  dateRange?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, value.toString());
          }
        });
      }

      return api.queries.reviews.getMany(`?${params}`);
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useReviewsStats() {
  return useQuery({
    queryKey: ["reviews-stats"],
    queryFn: api.queries.reviews.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useReviewsAnalytics(type?: string) {
  return useQuery({
    queryKey: ["reviews-analytics", type],
    queryFn: () => api.queries.reviews.getAnalytics(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useReviewsActivity(hours: number = 24) {
  return useQuery({
    queryKey: ["reviews-activity", hours],
    queryFn: () => api.queries.reviews.getActivity(hours),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useRetryReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => api.mutations.reviews.retry(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review retry initiated");
    },
    onError: () => {
      toast.error("Failed to retry review");
    },
  });
}

export function useSubmitReviewFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      reviewId: string;
      rating: number;
      comment?: string;
    }) => api.mutations.reviews.submitFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Feedback submitted successfully");
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });
}

// Personas hooks
export function usePersonas() {
  return useInfiniteQuery({
    queryKey: ["personas"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.queries.personas.getMany(
        `?page=${pageParam}&limit=20`,
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.page < pagination.pages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePersona(id: string) {
  return useQuery({
    queryKey: ["persona", id],
    queryFn: () => api.queries.personas.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

export function useCreatePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description: string; prompt: string }) =>
      api.mutations.personas.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Persona created successfully");
    },
    onError: () => {
      toast.error("Failed to create persona");
    },
  });
}

export function useUpdatePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; prompt?: string };
    }) => api.mutations.personas.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["persona"] });
      toast.success("Persona updated successfully");
    },
    onError: () => {
      toast.error("Failed to update persona");
    },
  });
}

export function useDeletePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.mutations.personas.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Persona deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to delete persona";
      toast.error(message);
    },
  });
}
