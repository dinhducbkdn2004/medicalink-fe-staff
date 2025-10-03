/**
 * Work Location API Service
 * Handles all work location-related API calls
 */

import { apiClient } from "./core/client";
import type { PaginatedResponse, ApiResponse } from "@/types";
import type {
	WorkLocation,
	CreateWorkLocationRequest,
	UpdateWorkLocationRequest,
	WorkLocationQueryParams,
	WorkLocationStats,
} from "@/types/api/locations.types";

// Get all work locations with pagination
export const getWorkLocations = (params?: WorkLocationQueryParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<WorkLocation>>>(
		"/work-locations",
		{
			params,
		}
	);

// Get all active work locations (for dropdowns)
export const getActiveWorkLocations = () =>
	apiClient.get<ApiResponse<WorkLocation[]>>("/work-locations/public");

// Get work location by ID
export const getWorkLocationById = (id: string) =>
	apiClient.get<ApiResponse<WorkLocation>>(`/work-locations/${id}`);

// Create new work location
export const createWorkLocation = (data: CreateWorkLocationRequest) =>
	apiClient.post<ApiResponse<WorkLocation>>("/work-locations", data);

// Update work location
export const updateWorkLocation = (
	id: string,
	data: UpdateWorkLocationRequest
) => apiClient.patch<ApiResponse<WorkLocation>>(`/work-locations/${id}`, data);

// Delete work location (soft delete)
export const deleteWorkLocation = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/work-locations/${id}`);

// Get work location statistics
export const getWorkLocationStats = () =>
	apiClient.get<ApiResponse<WorkLocationStats>>("/work-locations/stats");
