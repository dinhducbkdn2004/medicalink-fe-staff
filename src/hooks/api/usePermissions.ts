/**
 * Permission Hooks
 * React Query hooks for permission and group management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPermissions,
	getPermissionStats,
	getMyPermissions,
	getPermissionGroups,
	createPermissionGroup,
	updatePermissionGroup,
	deletePermissionGroup,
	getGroupPermissions,
	assignGroupPermission,
	revokeGroupPermission,
	getUserPermissions,
	assignUserPermission,
	revokeUserPermission,
	invalidateUserPermissionCache,
	refreshUserPermissionCache,
	getUserGroups,
	addUserToGroup,
	removeUserFromGroup,
} from "@/api/permissions";
import { extractApiData } from "@/api/core/utils";
import { CACHE_TIME } from "@/constants/api";
import type { PaginationParams } from "@/types";
import type {
	CreateGroupRequest,
	UpdateGroupRequest,
	AssignGroupPermissionRequest,
	AssignUserPermissionRequest,
	RevokeUserPermissionRequest,
	AddUserToGroupRequest,
} from "@/types/api/permissions.types";

// ==================== Query Keys ====================

export const permissionKeys = {
	all: ["permissions"] as const,
	lists: () => [...permissionKeys.all, "list"] as const,
	list: (params?: PaginationParams) =>
		[...permissionKeys.lists(), params] as const,
	stats: () => [...permissionKeys.all, "stats"] as const,
	me: () => [...permissionKeys.all, "me"] as const,
	groups: () => [...permissionKeys.all, "groups"] as const,
	group: (groupId: string) => [...permissionKeys.groups(), groupId] as const,
	groupPermissions: (groupId: string) =>
		[...permissionKeys.group(groupId), "permissions"] as const,
	userPermissions: (userId: string) =>
		[...permissionKeys.all, "users", userId] as const,
	userGroups: (userId: string) =>
		[...permissionKeys.all, "users", userId, "groups"] as const,
};

// ==================== Permission Query Hooks ====================

/**
 * Get all permissions (read-only)
 * Permissions are managed by backend, not editable via API
 */
export const usePermissions = (params?: PaginationParams) => {
	return useQuery({
		queryKey: permissionKeys.list(params),
		queryFn: async () => extractApiData(await getPermissions(params)),
		staleTime: CACHE_TIME.LONG, // Permissions rarely change
	});
};

/**
 * Get permission statistics
 */
export const usePermissionStats = () => {
	return useQuery({
		queryKey: permissionKeys.stats(),
		queryFn: async () => extractApiData(await getPermissionStats()),
		staleTime: CACHE_TIME.MEDIUM,
	});
};

/**
 * Get current user's permissions
 */
export const useMyPermissions = () => {
	return useQuery({
		queryKey: permissionKeys.me(),
		queryFn: async () => extractApiData(await getMyPermissions()),
		staleTime: CACHE_TIME.MEDIUM,
	});
};

// ==================== Permission Group Hooks ====================

/**
 * Get all permission groups
 */
export const usePermissionGroups = () => {
	return useQuery({
		queryKey: permissionKeys.groups(),
		queryFn: async () => extractApiData(await getPermissionGroups()),
		staleTime: CACHE_TIME.MEDIUM,
	});
};

/**
 * Get permissions for a specific group
 */
export const useGroupPermissions = (groupId: string) => {
	return useQuery({
		queryKey: permissionKeys.groupPermissions(groupId),
		queryFn: async () => extractApiData(await getGroupPermissions(groupId)),
		enabled: !!groupId,
		staleTime: CACHE_TIME.MEDIUM,
	});
};

/**
 * Create permission group mutation
 */
export const useCreatePermissionGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateGroupRequest) => createPermissionGroup(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.groups() });
		},
	});
};

/**
 * Update permission group mutation
 */
export const useUpdatePermissionGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			data,
		}: {
			groupId: string;
			data: UpdateGroupRequest;
		}) => updatePermissionGroup(groupId, data),
		onSuccess: (_, { groupId }) => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.groups() });
			queryClient.invalidateQueries({
				queryKey: permissionKeys.group(groupId),
			});
		},
	});
};

/**
 * Delete permission group mutation
 */
export const useDeletePermissionGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (groupId: string) => deletePermissionGroup(groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: permissionKeys.groups() });
		},
	});
};

/**
 * Assign permission to group mutation
 */
export const useAssignGroupPermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			data,
		}: {
			groupId: string;
			data: AssignGroupPermissionRequest;
		}) => assignGroupPermission(groupId, data),
		onSuccess: (_, { groupId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.groupPermissions(groupId),
			});
		},
	});
};

/**
 * Revoke permission from group mutation
 */
export const useRevokeGroupPermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			permissionId,
		}: {
			groupId: string;
			permissionId: string;
		}) => revokeGroupPermission(groupId, { permissionId }),
		onSuccess: (_, { groupId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.groupPermissions(groupId),
			});
		},
	});
};

// ==================== User Permission Hooks ====================

/**
 * Get user permissions
 */
export const useUserPermissions = (userId: string) => {
	return useQuery({
		queryKey: permissionKeys.userPermissions(userId),
		queryFn: async () => extractApiData(await getUserPermissions(userId)),
		enabled: !!userId,
		staleTime: CACHE_TIME.MEDIUM,
	});
};

/**
 * Get user groups
 */
export const useUserGroups = (userId: string) => {
	return useQuery({
		queryKey: permissionKeys.userGroups(userId),
		queryFn: async () => extractApiData(await getUserGroups(userId)),
		enabled: !!userId,
		staleTime: CACHE_TIME.MEDIUM,
	});
};

/**
 * Assign permission to user mutation
 */
export const useAssignUserPermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: AssignUserPermissionRequest) =>
			assignUserPermission(data),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userPermissions(userId),
			});
		},
	});
};

/**
 * Revoke permission from user mutation
 */
export const useRevokeUserPermission = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: RevokeUserPermissionRequest) =>
			revokeUserPermission(data),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userPermissions(userId),
			});
		},
	});
};

/**
 * Add user to group mutation
 */
export const useAddUserToGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userId,
			data,
		}: {
			userId: string;
			data: AddUserToGroupRequest;
		}) => addUserToGroup(userId, data),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userGroups(userId),
			});
		},
	});
};

/**
 * Remove user from group mutation
 */
export const useRemoveUserFromGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
			removeUserFromGroup(userId, groupId),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userGroups(userId),
			});
		},
	});
};

/**
 * Refresh user permission cache mutation
 */
export const useRefreshUserPermissionCache = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => refreshUserPermissionCache(userId),
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userPermissions(userId),
			});
		},
	});
};

/**
 * Invalidate user permission cache mutation
 */
export const useInvalidateUserPermissionCache = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => invalidateUserPermissionCache(userId),
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries({
				queryKey: permissionKeys.userPermissions(userId),
			});
		},
	});
};
