/**
 * Doctor API Service
 * Handles all doctor-related API calls including accounts and profiles
 */

import { apiClient } from "./core/client";
import type { PaginatedResponse, ApiResponse } from "@/types";
import type {
	Doctor,
	DoctorComplete,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	DoctorQueryParams,
	DoctorProfile,
	UpdateDoctorProfileRequest,
	DoctorProfileQueryParams,
	DoctorStats,
} from "@/types/api/doctors.types";

// Get all doctors with pagination and filters (via staff endpoint with DOCTOR role filter)
export const getDoctors = (params?: DoctorQueryParams) =>
	apiClient.get<PaginatedResponse<Doctor>>("/doctors", {
		params,
	});

// Get doctor by ID (account only via staff endpoint)
export const getDoctorById = (id: string) =>
	apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);

// Get doctor with complete profile information
export const getDoctorComplete = (id: string) =>
	apiClient.get<ApiResponse<DoctorComplete>>(`/doctors/${id}/complete`);

// Create new doctor (via staff endpoint with DOCTOR role)
export const createDoctor = (data: CreateDoctorRequest) =>
	apiClient.post<ApiResponse<Doctor>>("/doctors", data);

// Update doctor (via staff endpoint)
export const updateDoctor = (id: string, data: UpdateDoctorRequest) =>
	apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data);

// Delete doctor (soft delete via staff endpoint)
export const deleteDoctor = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/doctors/${id}`);

// Change doctor password (admin function via staff endpoint)
export const changeDoctorPassword = (id: string, newPassword: string) =>
	apiClient.patch<ApiResponse<{ message: string; success: boolean }>>(
		`/doctors/${id}`,
		{
			password: newPassword,
		}
	);

// Get doctor statistics
export const getDoctorStats = () =>
	apiClient.get<ApiResponse<DoctorStats>>("/doctors/stats");

// ==================== Doctor Profile Management ====================

// Get public doctor profiles with pagination
export const getPublicDoctorProfiles = (params?: DoctorProfileQueryParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<DoctorProfile>>>(
		"/doctors/profile/public",
		{
			params,
		}
	);

// Update doctor profile
export const updateDoctorProfile = (
	profileId: string,
	data: UpdateDoctorProfileRequest
) =>
	apiClient.patch<ApiResponse<DoctorProfile>>(
		`/doctors/profile/${profileId}`,
		data
	);

// Toggle doctor profile active status
export const toggleDoctorProfileActive = (profileId: string) =>
	apiClient.patch<ApiResponse<DoctorProfile>>(
		`/doctors/profile/${profileId}/toggle-active`
	);
