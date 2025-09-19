import { apiClient } from "./core/client";
import type {
	Specialty,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

// Get all specialties with pagination
export const getSpecialties = (
	params?: PaginationParams & {
		search?: string;
		isActive?: boolean;
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Specialty>>>("/specialties", {
		params,
	});

// Get all active specialties (for dropdowns)
export const getActiveSpecialties = () =>
	apiClient.get<ApiResponse<Specialty[]>>("/specialties/public");

// Get specialty by ID
export const getSpecialtyById = (id: string) =>
	apiClient.get<ApiResponse<Specialty>>(`/specialties/${id}`);

// Create new specialty
export const createSpecialty = (data: CreateSpecialtyRequest) =>
	apiClient.post<ApiResponse<Specialty>>("/specialties", data);

// Update specialty
export const updateSpecialty = (id: string, data: UpdateSpecialtyRequest) =>
	apiClient.patch<ApiResponse<Specialty>>(`/specialties/${id}`, data);

// Delete specialty (soft delete)
export const deleteSpecialty = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/specialties/${id}`);

// Activate/Deactivate specialty
export const toggleSpecialtyStatus = (id: string, isActive: boolean) =>
	apiClient.patch<ApiResponse<Specialty>>(`/specialties/${id}/status`, {
		isActive,
	});

// Get specialty statistics
export const getSpecialtyStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			active: number;
			inactive: number;
			withDoctors: number;
		}>
	>("/specialties/stats");
