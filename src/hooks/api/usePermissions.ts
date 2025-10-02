import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getPermissions,
	getPermissionById,
	createPermission,
	updatePermission,
	deletePermission,
	getRoles,
	getRoleById,
	updateRolePermissions,
	getRolePermissionsMatrix,
} from "@/api/permissions";
import { extractApiData } from "@/api/core/utils";
import { CACHE_TIME } from "@/constants/api";
import type {
	PaginationParams,
	CreatePermissionRequest,
	UpdatePermissionRequest,
	UpdateRolePermissionsRequest,
} from "@/types";

export const permissionKeys = {
	all: ["permissions"] as const,
	lists: () => [...permissionKeys.all, "list"] as const,
	list: (params?: PaginationParams) =>
		[...permissionKeys.lists(), params] as const,
	details: () => [...permissionKeys.all, "detail"] as const,
	detail: (id: string) => [...permissionKeys.details(), id] as const,
};

export const roleKeys = {
	all: ["roles"] as const,
	lists: () => [...roleKeys.all, "list"] as const,
	list: (params?: PaginationParams) => [...roleKeys.lists(), params] as const,
	details: () => [...roleKeys.all, "detail"] as const,
	detail: (id: string) => [...roleKeys.details(), id] as const,
	matrix: () => [...roleKeys.all, "matrix"] as const,
};

/**
 * Permission Query Hooks
 */

export const usePermissions = (params?: PaginationParams) => {
	return useQuery({
		queryKey: permissionKeys.list(params),
		queryFn: async () => extractApiData(await getPermissions(params)),
		staleTime: CACHE_TIME.MEDIUM,
	});
};

export const usePermission = (id: string) =>
	useQuery({
		queryKey: permissionKeys.detail(id),
		queryFn: async () => extractApiData(await getPermissionById(id)),
		enabled: !!id,
	});

/**
 * Role Query Hooks
 */

export const useRoles = (params?: PaginationParams) =>
	useQuery({
		queryKey: roleKeys.list(params),
		queryFn: async () => extractApiData(await getRoles(params)),
		staleTime: CACHE_TIME.MEDIUM,
	});

export const useRole = (id: string) =>
	useQuery({
		queryKey: roleKeys.detail(id),
		queryFn: async () => extractApiData(await getRoleById(id)),
		enabled: !!id,
	});

export const useRolePermissionsMatrix = () =>
	useQuery({
		queryKey: roleKeys.matrix(),
		queryFn: async () => extractApiData(await getRolePermissionsMatrix()),
		staleTime: CACHE_TIME.MEDIUM,
	});

/**
 * Permission Mutation Hooks
 */

export const useCreatePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreatePermissionRequest) =>
			extractApiData(await createPermission(data)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
			queryClient.invalidateQueries({ queryKey: roleKeys.matrix() });
		},
	});
};

export const useUpdatePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdatePermissionRequest;
		}) => extractApiData(await updatePermission(id, data)),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
			queryClient.invalidateQueries({ queryKey: permissionKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: roleKeys.matrix() });
		},
	});
};

export const useDeletePermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) =>
			extractApiData(await deletePermission(id)),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
			queryClient.removeQueries({ queryKey: permissionKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: roleKeys.matrix() });
		},
	});
};

/**
 * Role Permission Mutation Hooks
 */

export const useUpdateRolePermissions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			roleId,
			data,
		}: {
			roleId: string;
			data: UpdateRolePermissionsRequest;
		}) => extractApiData(await updateRolePermissions(roleId, data)),
		onSuccess: (_, { roleId }) => {
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
			queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
			queryClient.invalidateQueries({ queryKey: roleKeys.matrix() });
		},
	});
};
