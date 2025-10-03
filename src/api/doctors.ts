/**
 * Doctor API Service
 * Handles all doctor-related API calls including accounts and profiles
 */

import { apiClient } from "./core/client";
import type { PaginatedResponse } from "@/types";
import type {
	Doctor,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	DoctorQueryParams,
	DoctorProfile,
	UpdateDoctorProfileRequest,
	DoctorProfileQueryParams,
	DoctorStats,
} from "@/types/api/doctors.types";

// Get all doctors with pagination and filters
export const getDoctors = (params?: DoctorQueryParams) =>
	apiClient.get<PaginatedResponse<Doctor>>("/doctors", {
		params,
	});

// Get doctor by ID (account only)
export const getDoctorById = (id: string) =>
	apiClient.get<Doctor>(`/doctors/${id}`);

// Get doctor with complete profile information
export const getDoctorComplete = (id: string) =>
	apiClient.get<Doctor>(`/doctors/${id}/complete`);

// Create new doctor
export const createDoctor = (data: CreateDoctorRequest) =>
	apiClient.post<Doctor>("/doctors", data);

// Update doctor
export const updateDoctor = (id: string, data: UpdateDoctorRequest) =>
	apiClient.patch<Doctor>(`/doctors/${id}`, data);

// Delete doctor (soft delete)
export const deleteDoctor = (id: string) =>
	apiClient.delete<Doctor>(`/doctors/${id}`);

// Change doctor password (admin function)
export const changeDoctorPassword = (id: string, newPassword: string) =>
	apiClient.patch<{ message: string; success: boolean }>(`/doctors/${id}`, {
		password: newPassword,
	});

// Get doctor statistics
export const getDoctorStats = () =>
	apiClient.get<DoctorStats>("/doctors/stats");

// ==================== Doctor Profile Management ====================

// Get public doctor profiles with pagination
export const getPublicDoctorProfiles = (params?: DoctorProfileQueryParams) =>
	apiClient.get<PaginatedResponse<DoctorProfile>>("/doctors/profile/public", {
		params,
	});

// Update doctor profile
export const updateDoctorProfile = (
	profileId: string,
	data: UpdateDoctorProfileRequest
) => apiClient.patch<DoctorProfile>(`/doctors/profile/${profileId}`, data);

// Toggle doctor profile active status
export const toggleDoctorProfileActive = (profileId: string) =>
	apiClient.patch<DoctorProfile>(`/doctors/profile/${profileId}/toggle-active`);
