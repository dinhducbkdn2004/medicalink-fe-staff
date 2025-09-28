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
import { extractApiData, extractPaginatedData } from "@/api/core/utils";
import { CACHE_TIME } from "@/constants/api";
import type {
	PaginationParams,
	CreateStaffRequest,
	UpdateStaffRequest,
} from "@/types";

export const staffKeys = {
	all: ["staffs"] as const,
	lists: () => [...staffKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			email?: string;
			isMale?: boolean;
			createdFrom?: string;
			createdTo?: string;
			role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
		}
	) => [...staffKeys.lists(), params] as const,
	details: () => [...staffKeys.all, "detail"] as const,
	detail: (id: string) => [...staffKeys.details(), id] as const,
	stats: () => [...staffKeys.all, "stats"] as const,
};

export const useStaffs = (
	params?: PaginationParams & {
		search?: string;
		email?: string;
		isMale?: boolean;
		createdFrom?: string;
		createdTo?: string;
		role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	}
) => {
	return useQuery({
		queryKey: staffKeys.list(params),
		queryFn: async () => extractPaginatedData(await getStaffs(params)),
		staleTime: CACHE_TIME.MEDIUM,
	});
};

export const useStaff = (id: string) =>
	useQuery({
		queryKey: staffKeys.detail(id),
		queryFn: async () => extractApiData(await getStaffById(id)),
		enabled: !!id,
	});

export const useStaffStats = () =>
	useQuery({
		queryKey: staffKeys.stats(),
		queryFn: async () => extractApiData(await getStaffStats()),
		staleTime: 1000 * 60 * 5,
	});

export const useCreateStaff = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateStaffRequest) =>
			extractApiData(await createStaff(data)),
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
		}) => extractApiData(await updateStaff(id, data)),
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
		mutationFn: async (id: string) => extractApiData(await deleteStaff(id)),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
			queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
			queryClient.removeQueries({ queryKey: staffKeys.detail(id) });
		},
	});
};

// Change staff password (admin function)
export const useChangeStaffPassword = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			newPassword,
		}: {
			userId: string;
			newPassword: string;
		}) => extractApiData(await changeStaffPassword(userId, newPassword)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
		},
	});
};
