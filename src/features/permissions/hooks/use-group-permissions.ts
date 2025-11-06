/**
 * Group Permissions Hook
 * Manages permissions assigned to groups
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionService } from '@/api/services/permission.service'
import type {
  AssignGroupPermissionRequest,
  RevokeGroupPermissionRequest,
} from '@/api/types/permission.types'
import { permissionGroupKeys } from './use-permission-groups'

/**
 * Fetch permissions for a specific group
 */
export function useGroupPermissions(groupId: string, tenantId?: string) {
  return useQuery({
    queryKey: [...permissionGroupKeys.detail(groupId), 'permissions', tenantId],
    queryFn: () =>
      permissionService.getGroupPermissions(
        groupId,
        tenantId ? { tenantId } : undefined
      ),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Assign a permission to a group
 */
export function useAssignGroupPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string
      data: AssignGroupPermissionRequest
    }) => permissionService.assignGroupPermission(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...permissionGroupKeys.detail(variables.groupId),
          'permissions',
        ],
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Permission assigned to group successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign permission: ${error.message}`)
    },
  })
}

/**
 * Revoke a permission from a group
 */
export function useRevokeGroupPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string
      data: RevokeGroupPermissionRequest
    }) => permissionService.revokeGroupPermission(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...permissionGroupKeys.detail(variables.groupId),
          'permissions',
        ],
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Permission revoked from group successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to revoke permission: ${error.message}`)
    },
  })
}
