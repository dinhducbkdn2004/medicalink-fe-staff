/**
 * Specialty API Service
 * Handles all specialty-related API calls including info sections
 */

import { apiClient } from "./core/client";
import type { PaginatedResponse, ApiResponse } from "@/types";
import type {
	Specialty,
	InfoSection,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
	CreateInfoSectionRequest,
	UpdateInfoSectionRequest,
	SpecialtyQueryParams,
	SpecialtyStats,
} from "@/types/api/specialties.types";

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
	apiClient.get<ApiResponse<SpecialtyStats>>("/specialties/stats");

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
