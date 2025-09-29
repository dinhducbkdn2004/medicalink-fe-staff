import { apiClient } from "./core/client";
import type {
	Doctor,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	PaginatedResponse,
} from "@/types";

// Get all doctors with pagination and filters
export const getDoctors = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "asc" | "desc";
}) =>
	apiClient.get<PaginatedResponse<Doctor>>("/doctors", {
		params,
	});

// Get doctor by ID
export const getDoctorById = (id: string) =>
	apiClient.get<Doctor>(`/doctors/${id}`);

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
	apiClient.get<{
		total: number;
		recentlyCreated: number;
	}>("/doctors/stats");
