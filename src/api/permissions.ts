import { apiClient } from "./core/client";
import type { ApiResponse, PaginationParams } from "@/types";

// Types for permissions
export interface Permission {
	id: string;
	name: string;
	description: string;
	module: string;
	createdAt: string;
	updatedAt: string;
}

export interface Role {
	id: string;
	name: string;
	description: string;
	permissions: Permission[];
	userCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateRolePermissionsRequest {
	permissionIds: string[];
}

export interface CreatePermissionRequest {
	name: string;
	description: string;
	module: string;
}

export interface UpdatePermissionRequest {
	name?: string;
	description?: string;
	module?: string;
}

/**
 * Permission API endpoints
 */

// Get all permissions
export const getPermissions = (params?: PaginationParams) =>
	apiClient.get<ApiResponse<Permission[]>>("/permissions", { params });

// Get permission by ID
export const getPermissionById = (id: string) =>
	apiClient.get<ApiResponse<Permission>>(`/permissions/${id}`);

// Create permission
export const createPermission = (data: CreatePermissionRequest) =>
	apiClient.post<ApiResponse<Permission>>("/permissions", data);

// Update permission
export const updatePermission = (id: string, data: UpdatePermissionRequest) =>
	apiClient.put<ApiResponse<Permission>>(`/permissions/${id}`, data);

// Delete permission
export const deletePermission = (id: string) =>
	apiClient.delete<ApiResponse<void>>(`/permissions/${id}`);

/**
 * Role API endpoints
 */

// Get all roles with their permissions
export const getRoles = (params?: PaginationParams) =>
	apiClient.get<ApiResponse<Role[]>>("/roles", { params });

// Get role by ID with permissions
export const getRoleById = (id: string) =>
	apiClient.get<ApiResponse<Role>>(`/roles/${id}`);

// Update role permissions
export const updateRolePermissions = (
	roleId: string,
	data: UpdateRolePermissionsRequest
) => apiClient.put<ApiResponse<Role>>(`/roles/${roleId}/permissions`, data);

// Get role permissions matrix
export const getRolePermissionsMatrix = () =>
	apiClient.get<ApiResponse<{ roles: Role[]; permissions: Permission[] }>>(
		"/roles/permissions-matrix"
	);
