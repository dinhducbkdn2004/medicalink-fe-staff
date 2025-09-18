/**
 * API Modules - Centralized exports for all API functions
 */

// Client and utilities
export { apiClient } from "./core/client";
export { extractApiData, apiCall } from "./core/utils";
export { handleApiError } from "./core/errorHandler";

// API modules
export * from "./auth";
export * from "./admins";
export * from "./doctors";
export * from "./specialties";
export * from "./locations";
export * from "./blogs";
export * from "./questions";
