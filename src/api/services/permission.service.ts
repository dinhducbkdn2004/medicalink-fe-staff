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

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>('/permissions')
    return response.data
  },

  async getPermissionStats(): Promise<PermissionStats> {
    const response = await apiClient.get<PermissionStats>('/permissions/stats')
    return response.data
  },

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

  async getMyPermissions(): Promise<UserPermissionSnapshot> {
    const response =
      await apiClient.get<UserPermissionSnapshot>('/permissions/me')
    return response.data
  },

  async assignUserPermission(
    data: AssignUserPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>(
      '/permissions/users/assign',
      data
    )
    return response.data
  },

  async revokeUserPermission(
    data: RevokeUserPermissionRequest
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      '/permissions/users/revoke',
      { data }
    )
    return response.data
  },

  async checkPermission(
    data: CheckPermissionRequest
  ): Promise<CheckPermissionResponse> {
    const response = await apiClient.post<CheckPermissionResponse>(
      '/permissions/check',
      data
    )
    return response.data
  },

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

  async invalidateUserPermissionCache(
    userId: string
  ): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/users/${userId}/cache`
    )
    return response.data
  },

  async getPermissionGroups(
    params?: PermissionQueryParams
  ): Promise<PermissionGroupListResponse> {
    const response = await apiClient.get<PermissionGroupListResponse>(
      '/permissions/groups',
      { params }
    )
    return response.data
  },

  async createPermissionGroup(
    data: CreatePermissionGroupRequest
  ): Promise<PermissionGroup> {
    const response = await apiClient.post<PermissionGroup>(
      '/permissions/groups',
      data
    )
    return response.data
  },

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

  async deletePermissionGroup(groupId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(
      `/permissions/groups/${groupId}`
    )
    return response.data
  },

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
