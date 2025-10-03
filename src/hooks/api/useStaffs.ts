/**
 * Staff Hooks
 * React Query hooks for staff-related API calls
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getStaffs,
	getStaffById,
	createStaff,
	updateStaff,
	deleteStaff,
	changeStaffPassword,
	getStaffStats,
} from "@/api/staffs";
import { CACHE_TIME } from "@/constants/api";
import type {
	CreateStaffRequest,
	UpdateStaffRequest,
	StaffQueryParams,
} from "@/types/api/staffs.types";

export const staffKeys = {
	all: ["staffs"] as const,
	lists: () => [...staffKeys.all, "list"] as const,
	list: (params?: StaffQueryParams) => [...staffKeys.lists(), params] as const,
	details: () => [...staffKeys.all, "detail"] as const,
	detail: (id: string) => [...staffKeys.details(), id] as const,
	stats: () => [...staffKeys.all, "stats"] as const,
};

export const useStaffs = (params?: StaffQueryParams) => {
	return useQuery({
		queryKey: staffKeys.list(params),
		queryFn: async () => {
			const response = await getStaffs(params);
			return response.data;
		},
		staleTime: CACHE_TIME.MEDIUM,
	});
};

export const useStaff = (id: string) =>
	useQuery({
		queryKey: staffKeys.detail(id),
		queryFn: async () => {
			const response = await getStaffById(id);
			return response.data;
		},
		enabled: !!id,
	});

export const useStaffStats = () =>
	useQuery({
		queryKey: staffKeys.stats(),
		queryFn: async () => {
			const response = await getStaffStats();
			return response.data;
		},
		staleTime: CACHE_TIME.MEDIUM,
	});

export const useCreateStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateStaffRequest) => {
			const response = await createStaff(data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
			queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
		},
	});
};

export const useUpdateStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateStaffRequest;
		}) => {
			const response = await updateStaff(id, data);
			return response.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
			queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
		},
	});
};

export const useDeleteStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await deleteStaff(id);
			return response.data;
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
			queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
			queryClient.removeQueries({ queryKey: staffKeys.detail(id) });
		},
	});
};

export const useChangeStaffPassword = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			newPassword,
		}: {
			userId: string;
			newPassword: string;
		}) => {
			const response = await changeStaffPassword(userId, newPassword);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
		},
	});
};
