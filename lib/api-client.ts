/**
 * =================================
 * API Client
 * Description: Centralized module for making API requests.
 * Author: Code Reverb Team
 * Date: 2025-12-14
 * =================================
 */

import { privateAxios } from "@/config/axios.config";

// Helper function for making authenticated requests
async function apiRequest<T>(
  endpoint: string,
  options: {
    body?: any;
    method: "POST" | "PUT" | "PATCH" | "DELETE" | "GET";
  }
): Promise<T | null> {
  try {
    let response;

    switch (options.method) {
      case "GET":
        response = await privateAxios.get<any | null>(
          endpoint,
          options.body ?? {}
        );
        break;
      case "DELETE":
        response = await privateAxios.delete<any | null>(endpoint);
        break;
      case "POST":
        response = await privateAxios.post<any | null>(
          endpoint,
          options.body ?? {}
        );
        break;
      case "PUT":
        response = await privateAxios.put<any | null>(
          endpoint,
          options.body ?? {}
        );
        break;
      case "PATCH":
        response = await privateAxios.patch<any | null>(
          endpoint,
          options.body ?? {}
        );
        break;
      default:
        console.error("Invalid HTTP method");
        return null;
    }

    return response?.data;
  } catch (error: Error | any) {
    if (error.response?.data) throw new Error(error.response?.data.error);
    else throw new Error("Sorry, an unexpected error occurred");
  }
}

// API Methods
export const api = {
  queries: {},
  mutations: {},
};
