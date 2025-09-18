import { apiClient } from "./core/client";
import type {
	Location,
	CreateLocationRequest,
	UpdateLocationRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

/**
 * Location management API endpoints
 */

// Get all locations with pagination
export const getLocations = (
	params?: PaginationParams & {
		search?: string;
		city?: string;
		state?: string;
		isActive?: boolean;
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Location>>>("/locations", {
		params,
	});

// Get all active locations (for dropdowns)
export const getActiveLocations = () =>
	apiClient.get<ApiResponse<Location[]>>("/locations/active");

// Get location by ID
export const getLocationById = (id: string) =>
	apiClient.get<ApiResponse<Location>>(`/locations/${id}`);

// Create new location
export const createLocation = (data: CreateLocationRequest) =>
	apiClient.post<ApiResponse<Location>>("/locations", data);

// Update location
export const updateLocation = (id: string, data: UpdateLocationRequest) =>
	apiClient.patch<ApiResponse<Location>>(`/locations/${id}`, data);

// Delete location (soft delete)
export const deleteLocation = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/locations/${id}`);

// Activate/Deactivate location
export const toggleLocationStatus = (id: string, isActive: boolean) =>
	apiClient.patch<ApiResponse<Location>>(`/locations/${id}/status`, {
		isActive,
	});

// Get locations by city
export const getLocationsByCity = (city: string, params?: PaginationParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<Location>>>(
		`/locations/city/${city}`,
		{
			params,
		}
	);

// Get location statistics
export const getLocationStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			active: number;
			inactive: number;
			byCities: Array<{ city: string; count: number }>;
			byStates: Array<{ state: string; count: number }>;
		}>
	>("/locations/stats");
