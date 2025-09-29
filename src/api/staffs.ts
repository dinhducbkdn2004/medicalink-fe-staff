import { apiClient } from "./core/client";
import type {
	StaffAccount,
	CreateStaffRequest,
	UpdateStaffRequest,
	PaginatedResponse,
} from "@/types";

export const getStaffs = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "asc" | "desc";
}) =>
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

// Change user password (admin function)
export const changeStaffPassword = (id: string, newPassword: string) =>
	apiClient.patch<{ message: string; success: boolean }>(`/staffs/${id}`, {
		password: newPassword,
	});

export const getStaffStats = () =>
	apiClient.get<{
		total: number;
		recentlyCreated: number;
	}>("/staffs/stats");
