/**
 * =================================
 * API Client
 * Description: Centralized module for making API requests.
 * Author: Code Reverb Team
 * Date: 2025-12-14
 * =================================
 */

import { privateAxios } from "@/config/axios.config";
import { User } from "./generated/prisma/client";

// Helper function for making authenticated requests
async function apiRequest<T>(
  endpoint: string,
  options: {
    body?: unknown;
    method: "POST" | "PUT" | "PATCH" | "DELETE" | "GET";
  },
): Promise<T | null> {
  try {
    let response: { data?: T } | undefined;

    switch (options.method) {
      case "GET":
        response = await privateAxios.get<T>(
          endpoint,
          options.body ? { params: options.body } : {},
        );
        break;
      case "DELETE":
        response = await privateAxios.delete<T>(endpoint);
        break;
      case "POST":
        response = await privateAxios.post<T>(endpoint, options.body ?? {});
        break;
      case "PUT":
        response = await privateAxios.put<T>(endpoint, options.body ?? {});
        break;
      case "PATCH":
        response = await privateAxios.patch<T>(endpoint, options.body ?? {});
        break;
      default:
        console.error("Invalid HTTP method");
        return null;
    }

    return response?.data ?? null;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
    }
    throw new Error("Sorry, an unexpected error occurred");
  }
}

// API Methods
export const api = {
  queries: {
    users: {
      getProfile: (): Promise<User | null> =>
        apiRequest("/users/profile", { method: "GET" }),
      getById: (id: string): Promise<User | null> =>
        apiRequest(`/users/${id}`, { method: "GET" }),
      getMany: (): Promise<User[] | null> =>
        apiRequest(`/users`, { method: "GET" }),
    },
    settings: {
      getProfile: (): Promise<any> =>
        apiRequest("/settings/profile", { method: "GET" }),
      getNotifications: (): Promise<any> =>
        apiRequest("/settings/notifications", { method: "GET" }),
      getAI: (): Promise<any> => apiRequest("/settings/ai", { method: "GET" }),
      getPrivacy: (): Promise<any> =>
        apiRequest("/settings/privacy", { method: "GET" }),
      getAppearance: (): Promise<any> =>
        apiRequest("/settings/appearance", { method: "GET" }),
      getApiKeys: (): Promise<any[] | null> =>
        apiRequest("/settings/api-keys", { method: "GET" }),
      getOrganization: (): Promise<any> =>
        apiRequest("/settings/organization", { method: "GET" }),
      getBilling: (): Promise<any> =>
        apiRequest("/settings/billing", { method: "GET" }),
      getSessions: (): Promise<any[] | null> =>
        apiRequest("/settings/sessions", { method: "GET" }),
    },
    reviews: {
      getMany: (queryString?: string): Promise<any> =>
        apiRequest(`/reviews${queryString || ""}`, { method: "GET" }),
      getStats: (): Promise<any> =>
        apiRequest("/reviews/stats", { method: "GET" }),
      getAnalytics: (type?: string): Promise<any> =>
        apiRequest(`/reviews/analytics${type ? `?type=${type}` : ""}`, {
          method: "GET",
        }),
      getActivity: (hours?: number): Promise<any[] | null> =>
        apiRequest(`/reviews/activity${hours ? `?hours=${hours}` : ""}`, {
          method: "GET",
        }),
    },
    personas: {
      getMany: (queryString?: string): Promise<any> =>
        apiRequest(`/personas${queryString || ""}`, { method: "GET" }),
      getById: (id: string): Promise<any> =>
        apiRequest(`/personas/${id}`, { method: "GET" }),
    },
  },
  mutations: {
    settings: {
      updateProfile: (data: any): Promise<any> =>
        apiRequest("/settings/profile", { method: "PUT", body: data }),
      updateNotifications: (data: any): Promise<any> =>
        apiRequest("/settings/notifications", { method: "PUT", body: data }),
      updateAI: (data: any): Promise<any> =>
        apiRequest("/settings/ai", { method: "PUT", body: data }),
      updatePrivacy: (data: any): Promise<any> =>
        apiRequest("/settings/privacy", { method: "PUT", body: data }),
      updateAppearance: (data: any): Promise<any> =>
        apiRequest("/settings/appearance", { method: "PUT", body: data }),
      createApiKey: (data: any): Promise<any> =>
        apiRequest("/settings/api-keys", { method: "POST", body: data }),
      deleteApiKey: (id: string): Promise<any> =>
        apiRequest(`/settings/api-keys/${id}`, { method: "DELETE" }),
      updateOrganization: (data: any): Promise<any> =>
        apiRequest("/settings/organization", { method: "PUT", body: data }),
      updateBilling: (data: any): Promise<any> =>
        apiRequest("/settings/billing", { method: "PUT", body: data }),
      changePassword: (data: any): Promise<any> =>
        apiRequest("/settings/password", { method: "PUT", body: data }),
      setup2FA: (): Promise<any> =>
        apiRequest("/settings/2fa/setup", { method: "POST" }),
      verify2FA: (data: any): Promise<any> =>
        apiRequest("/settings/2fa/verify", { method: "POST", body: data }),
      disable2FA: (): Promise<any> =>
        apiRequest("/settings/2fa", { method: "DELETE" }),
      revokeSession: (sessionId: string): Promise<any> =>
        apiRequest(`/settings/sessions/${sessionId}`, { method: "DELETE" }),
      revokeAllSessions: (): Promise<any> =>
        apiRequest("/settings/sessions", { method: "DELETE" }),
    },
    reviews: {
      create: (data: any): Promise<any> =>
        apiRequest("/reviews", { method: "POST", body: data }),
      retry: (reviewId: string): Promise<any> =>
        apiRequest(`/reviews/${reviewId}/retry`, { method: "POST" }),
      submitFeedback: (data: any): Promise<any> =>
        apiRequest(`/reviews/${data.reviewId}/feedback`, {
          method: "POST",
          body: data,
        }),
    },
    personas: {
      create: (data: any): Promise<any> =>
        apiRequest("/personas", { method: "POST", body: data }),
      update: (id: string, data: any): Promise<any> =>
        apiRequest(`/personas/${id}`, { method: "PUT", body: data }),
      delete: (id: string): Promise<any> =>
        apiRequest(`/personas/${id}`, { method: "DELETE" }),
    },
  },
};
