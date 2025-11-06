/**
 * Permission Management API Service
 * Handles all permission-related API calls
 */
import { apiClient } from '../core/client'
import type {
  Permission,
  PermissionStats,
  UserPermissionSnapshot,
  AssignUserPermissionRequest,
  RevokeUserPermissionRequest,
  CheckPermissionRequest,
  CheckPermissionResponse,
  PermissionGroup,
  CreatePermissionGroupRequest,
  UpdatePermissionGroupRequest,
  PermissionGroupListResponse,
  GroupPermission,
  AssignGroupPermissionRequest,
  RevokeGroupPermissionRequest,
  AddUserToGroupRequest,
  UserGroupMembershipListResponse,
  SuccessResponse,
  PermissionQueryParams,
} from '../types/permission.types'

// ============================================================================
// Permissions
// ============================================================================

export const permissionService = {
  /**
   * Get all available permissions in the system
   */
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>('/permissions')
    return response.data
  },

  /**
   * Get statistics about the permission system
   */
  async getPermissionStats(): Promise<PermissionStats> {
    const response = await apiClient.get<PermissionStats>('/permissions/stats')
    return response.data
  },

  // ==========================================================================
  // User Permissions
  // ==========================================================================

  /**
   * Get all permissions for a specific user (snapshot format)
   */
  async getUserPermissions(
    userId: string,
    params?: PermissionQueryParams
  ): Promise<UserPermissionSnapshot> {
    const response = await apiClient.get<UserPermissionSnapshot>(
      `/permissions/users/${userId}`,
      { params }
    )
    return response.data
  },

  /**
   * Get the current user's permissions
   */
  async getMyPermissions(): Promise<UserPermissionSnapshot> {
    const response =
      await apiClient.get<UserPermissionSnapshot>('/permissions/me')
    return response.data
  },

  /**
   * Assign a permission to a user
   */
  async assignUserPermission(
    data: AssignUserPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>(
      '/permissions/users/assign',
      data
    )
    return response.data
  },

  /**
   * Revoke a permission from a user
   */
  async revokeUserPermission(
    data: RevokeUserPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      '/permissions/users/revoke',
      { data }
    )
    return response.data
  },

  /**
   * Check if a user has a specific permission
   */
  async checkPermission(
    data: CheckPermissionRequest
  ): Promise<CheckPermissionResponse> {
    const response = await apiClient.post<CheckPermissionResponse>(
      '/permissions/check',
      data
    )
    return response.data
  },

  /**
   * Refresh the permission cache for a user
   */
  async refreshUserPermissionCache(
    userId: string,
    tenantId?: string
  ): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>(
      `/permissions/users/${userId}/refresh-cache`,
      null,
      { params: { tenantId } }
    )
    return response.data
  },

  /**
   * Invalidate the permission cache for a user
   */
  async invalidateUserPermissionCache(
    userId: string
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/users/${userId}/cache`
    )
    return response.data
  },

  // ==========================================================================
  // Permission Groups
  // ==========================================================================

  /**
   * Get all permission groups
   */
  async getPermissionGroups(
    params?: PermissionQueryParams
  ): Promise<PermissionGroupListResponse> {
    const response = await apiClient.get<PermissionGroupListResponse>(
      '/permissions/groups',
      { params }
    )
    return response.data
  },

  /**
   * Create a new permission group
   */
  async createPermissionGroup(
    data: CreatePermissionGroupRequest
  ): Promise<PermissionGroup> {
    const response = await apiClient.post<PermissionGroup>(
      '/permissions/groups',
      data
    )
    return response.data
  },

  /**
   * Update a permission group
   */
  async updatePermissionGroup(
    groupId: string,
    data: UpdatePermissionGroupRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.put<SuccessResponse>(
      `/permissions/groups/${groupId}`,
      data
    )
    return response.data
  },

  /**
   * Delete a permission group
   */
  async deletePermissionGroup(groupId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/groups/${groupId}`
    )
    return response.data
  },

  // ==========================================================================
  // Group Permissions
  // ==========================================================================

  /**
   * Get all permissions assigned to a group
   */
  async getGroupPermissions(
    groupId: string,
    params?: PermissionQueryParams
  ): Promise<GroupPermission[]> {
    const response = await apiClient.get<GroupPermission[]>(
      `/permissions/groups/${groupId}/permissions`,
      { params }
    )
    return response.data
  },

  /**
   * Assign a permission to a group
   */
  async assignGroupPermission(
    groupId: string,
    data: AssignGroupPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>(
      `/permissions/groups/${groupId}/permissions`,
      data
    )
    return response.data
  },

  /**
   * Revoke a permission from a group
   */
  async revokeGroupPermission(
    groupId: string,
    data: RevokeGroupPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/groups/${groupId}/permissions`,
      { data }
    )
    return response.data
  },

  // ==========================================================================
  // User Group Memberships
  // ==========================================================================

  /**
   * Get all groups a user belongs to
   */
  async getUserGroups(
    userId: string,
    params?: PermissionQueryParams
  ): Promise<UserGroupMembershipListResponse> {
    const response = await apiClient.get<UserGroupMembershipListResponse>(
      `/permissions/users/${userId}/groups`,
      { params }
    )
    return response.data
  },

  /**
   * Add a user to a group
   */
  async addUserToGroup(
    userId: string,
    data: AddUserToGroupRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>(
      `/permissions/users/${userId}/groups`,
      data
    )
    return response.data
  },

  /**
   * Remove a user from a group
   */
  async removeUserFromGroup(
    userId: string,
    groupId: string,
    tenantId?: string
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/users/${userId}/groups/${groupId}`,
      { params: { tenantId } }
    )
    return response.data
  },
}
