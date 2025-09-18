import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getAdmins,
	getAdminById,
	createAdmin,
	updateAdmin,
	deleteAdmin,
	toggleAdminStatus,
	getAdminStats,
} from "@/api/admins";
import { extractApiData } from "@/api/core/utils";
import { CACHE_TIME } from "@/constants/api";
import type {
	PaginationParams,
	CreateAdminRequest,
	UpdateAdminRequest,
} from "@/types";

// Query keys
export const adminKeys = {
	all: ["admins"] as const,
	lists: () => [...adminKeys.all, "list"] as const,
	list: (params?: PaginationParams) => [...adminKeys.lists(), params] as const,
	details: () => [...adminKeys.all, "detail"] as const,
	detail: (id: string) => [...adminKeys.details(), id] as const,
	stats: () => [...adminKeys.all, "stats"] as const,
};

/**
 * Admin Query Hooks
 */

// Get admins with pagination
export const useAdmins = (params?: PaginationParams) =>
	useQuery({
		queryKey: adminKeys.list(params),
		queryFn: async () => extractApiData(await getAdmins(params)),
		staleTime: CACHE_TIME.MEDIUM, // 5 minutes
	});

// Get admin by ID
export const useAdmin = (id: string) =>
	useQuery({
		queryKey: adminKeys.detail(id),
		queryFn: async () => extractApiData(await getAdminById(id)),
		enabled: !!id,
	});

// Get admin statistics
export const useAdminStats = () =>
	useQuery({
		queryKey: adminKeys.stats(),
		queryFn: async () => extractApiData(await getAdminStats()),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Admin Mutation Hooks
 */

// Create admin mutation
export const useCreateAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateAdminRequest) =>
			extractApiData(await createAdmin(data)),
		onSuccess: () => {
			// Invalidate admin lists and stats
			queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
			queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
		},
	});
};

// Update admin mutation
export const useUpdateAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateAdminRequest;
		}) => extractApiData(await updateAdmin(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate admin lists, detail, and stats
			queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
			queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
		},
	});
};

// Delete admin mutation
export const useDeleteAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteAdmin(id)),
		onSuccess: (_, id) => {
			// Invalidate admin lists and stats
			queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
			queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
			// Remove detail from cache
			queryClient.removeQueries({ queryKey: adminKeys.detail(id) });
		},
	});
};

// Toggle admin status mutation
export const useToggleAdminStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			extractApiData(await toggleAdminStatus(id, isActive)),
		onSuccess: (_, { id }) => {
			// Invalidate admin lists, detail, and stats
			queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
			queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
		},
	});
};
