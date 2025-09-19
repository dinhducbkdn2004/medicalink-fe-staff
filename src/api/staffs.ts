import { apiClient } from "./core/client";
import type {
	StaffAccount,
	CreateStaffRequest,
	UpdateStaffRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

export const getStaffs = (params?: PaginationParams) =>
	apiClient.get<ApiResponse<PaginatedResponse<StaffAccount>>>("/staffs", {
		params,
	});

export const getStaffById = (id: string) =>
	apiClient.get<ApiResponse<StaffAccount>>(`/staffs/${id}`);

export const createStaff = (data: CreateStaffRequest) =>
	apiClient.post<ApiResponse<StaffAccount>>("/staffs", data);

export const updateStaff = (id: string, data: UpdateStaffRequest) =>
	apiClient.patch<ApiResponse<StaffAccount>>(`/staffs/${id}`, data);

export const deleteStaff = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/staffs/${id}`);

export const getStaffStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			byRole: {
				SUPER_ADMIN: number;
				ADMIN: number;
				DOCTOR: number;
			};
			recentlyCreated: number;
			deleted: number;
		}>
	>("/staffs/stats");
