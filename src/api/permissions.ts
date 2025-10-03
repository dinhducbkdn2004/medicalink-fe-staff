/**
 * Permission API Service
 * Handles all permission-related API calls
 */

import { apiClient } from "./core/client";
import type { ApiResponse, PaginationParams } from "@/types";
import type {
	Permission,
	PermissionGroup,
	GroupPermission,
	CreateGroupRequest,
	UpdateGroupRequest,
	AssignGroupPermissionRequest,
	AssignUserPermissionRequest,
	RevokeUserPermissionRequest,
	AddUserToGroupRequest,
} from "@/types/api/permissions.types";

// ==================== Core Permission Endpoints ====================

// Get all permissions
export const getPermissions = (params?: PaginationParams) =>
	apiClient.get<ApiResponse<Permission[]>>("/permissions", { params });

// Get permission statistics
export const getPermissionStats = () =>
	apiClient.get<ApiResponse<any>>("/permissions/stats");

// Get current user's permissions
export const getMyPermissions = () =>
	apiClient.get<ApiResponse<Permission[]>>("/permissions/me");

// ==================== Permission Group Management ====================

// Get all permission groups
export const getPermissionGroups = () =>
	apiClient.get<ApiResponse<PermissionGroup[]>>("/permissions/groups");

// Create permission group
export const createPermissionGroup = (data: CreateGroupRequest) =>
	apiClient.post<ApiResponse<PermissionGroup>>("/permissions/groups", data);

// Update permission group
export const updatePermissionGroup = (
	groupId: string,
	data: UpdateGroupRequest
) =>
	apiClient.put<ApiResponse<PermissionGroup>>(
		`/permissions/groups/${groupId}`,
		data
	);

// Delete permission group
export const deletePermissionGroup = (groupId: string) =>
	apiClient.delete<ApiResponse<void>>(`/permissions/groups/${groupId}`);

// Get group permissions
export const getGroupPermissions = (groupId: string) =>
	apiClient.get<ApiResponse<GroupPermission[]>>(
		`/permissions/groups/${groupId}/permissions`
	);

// Assign permission to group
export const assignGroupPermission = (
	groupId: string,
	data: AssignGroupPermissionRequest
) =>
	apiClient.post<ApiResponse<void>>(
		`/permissions/groups/${groupId}/permissions`,
		data
	);

// Revoke permission from group
export const revokeGroupPermission = (
	groupId: string,
	data: { permissionId: string }
) =>
	apiClient.delete<ApiResponse<void>>(
		`/permissions/groups/${groupId}/permissions`,
		{ data }
	);

// ==================== User Permission Management ====================

// Get user permissions
export const getUserPermissions = (userId: string) =>
	apiClient.get<ApiResponse<Permission[]>>(`/permissions/users/${userId}`);

// Assign permission to user
export const assignUserPermission = (data: AssignUserPermissionRequest) =>
	apiClient.post<ApiResponse<void>>("/permissions/users/assign", data);

// Revoke permission from user
export const revokeUserPermission = (data: RevokeUserPermissionRequest) =>
	apiClient.delete<ApiResponse<void>>("/permissions/users/revoke", { data });

// Invalidate user permission cache
export const invalidateUserPermissionCache = (userId: string) =>
	apiClient.delete<ApiResponse<void>>(`/permissions/users/${userId}/cache`);

// Refresh user permission cache
export const refreshUserPermissionCache = (userId: string) =>
	apiClient.post<ApiResponse<void>>(
		`/permissions/users/${userId}/refresh-cache`
	);

// ==================== User Group Management ====================

// Get user groups
export const getUserGroups = (userId: string) =>
	apiClient.get<ApiResponse<PermissionGroup[]>>(
		`/permissions/users/${userId}/groups`
	);

// Add user to group
export const addUserToGroup = (userId: string, data: AddUserToGroupRequest) =>
	apiClient.post<ApiResponse<void>>(
		`/permissions/users/${userId}/groups`,
		data
	);

// Remove user from group
export const removeUserFromGroup = (userId: string, groupId: string) =>
	apiClient.delete<ApiResponse<void>>(
		`/permissions/users/${userId}/groups/${groupId}`
	);
