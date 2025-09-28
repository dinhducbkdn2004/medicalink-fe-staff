import { apiClient } from "./core/client";
import type {
	Specialty,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

// Re-export Specialty type for convenience
export type { Specialty };

export interface InfoSection {
	id: string;
	specialtyId: string;
	name: string;
	content: string;
	order?: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateInfoSectionRequest {
	specialtyId: string;
	name: string;
	content: string;
	order?: number;
}

export interface UpdateInfoSectionRequest {
	name?: string;
	content?: string;
	order?: number;
}

export interface SpecialtyQueryParams extends PaginationParams {
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	isActive?: boolean;
}

// Get all specialties with enhanced filtering and sorting
export const getSpecialties = (params?: SpecialtyQueryParams) =>
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

// Get all info sections for a specialty
export const getInfoSections = (specialtyId: string) =>
	apiClient.get<ApiResponse<InfoSection[]>>(
		`/specialties/${specialtyId}/info-sections`
	);

// Create info section
export const createInfoSection = (data: CreateInfoSectionRequest) =>
	apiClient.post<ApiResponse<InfoSection>>("/specialties/info-sections", data);

// Update info section
export const updateInfoSection = (id: string, data: UpdateInfoSectionRequest) =>
	apiClient.put<ApiResponse<InfoSection>>(
		`/specialties/info-section/${id}`,
		data
	);

// Delete info section
export const deleteInfoSection = (id: string) =>
	apiClient.delete<ApiResponse<void>>(`/specialties/info-section/${id}`);
