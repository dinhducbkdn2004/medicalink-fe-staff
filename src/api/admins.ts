import { apiClient } from "./core/client";
import type {
	StaffAccount,
	CreateAdminRequest,
	UpdateAdminRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

/**
 * Admin management API endpoints
 */

// Get all admins with pagination
export const getAdmins = (params?: PaginationParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<StaffAccount>>>("/admins", {
		params,
	});

// Get admin by ID
export const getAdminById = (id: string) =>
	apiClient.get<ApiResponse<StaffAccount>>(`/admins/${id}`);

// Create new admin
export const createAdmin = (data: CreateAdminRequest) =>
	apiClient.post<ApiResponse<StaffAccount>>("/admins", data);

// Update admin
export const updateAdmin = (id: string, data: UpdateAdminRequest) =>
	apiClient.patch<ApiResponse<StaffAccount>>(`/admins/${id}`, data);

// Delete admin (soft delete)
export const deleteAdmin = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/admins/${id}`);

// Activate/Deactivate admin
export const toggleAdminStatus = (id: string, isActive: boolean) =>
	apiClient.patch<ApiResponse<StaffAccount>>(`/admins/${id}/status`, {
		isActive,
	});

// Get admin statistics
export const getAdminStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			active: number;
			inactive: number;
			recentlyCreated: number;
		}>
	>("/admins/stats");
