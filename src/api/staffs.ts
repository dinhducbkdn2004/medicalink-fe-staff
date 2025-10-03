/**
 * Staff API Service
 * Handles all staff-related API calls (admin and super admin accounts)
 */

import { apiClient } from "./core/client";
import type { StaffAccount, PaginatedResponse } from "@/types";
import type {
	CreateStaffRequest,
	UpdateStaffRequest,
	StaffQueryParams,
	StaffStats,
} from "@/types/api/staffs.types";

export const getStaffs = (params?: StaffQueryParams) =>
	apiClient.get<PaginatedResponse<StaffAccount>>("/staffs", {
		params,
	});

export const getStaffById = (id: string) =>
	apiClient.get<StaffAccount>(`/staffs/${id}`);

export const createStaff = (data: CreateStaffRequest) =>
	apiClient.post<StaffAccount>("/staffs", data);

export const updateStaff = (id: string, data: UpdateStaffRequest) =>
	apiClient.patch<StaffAccount>(`/staffs/${id}`, data);

export const deleteStaff = (id: string) =>
	apiClient.delete<StaffAccount>(`/staffs/${id}`);

export const changeStaffPassword = (id: string, newPassword: string) =>
	apiClient.patch<{ message: string; success: boolean }>(`/staffs/${id}`, {
		password: newPassword,
	});

export const getStaffStats = () => apiClient.get<StaffStats>("/staffs/stats");
