import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionService } from '@/api/services/permission.service'
import type {
  AssignGroupPermissionRequest,
  RevokeGroupPermissionRequest,
} from '@/api/types/permission.types'
import { permissionGroupKeys } from './use-permission-groups'

export function useGroupPermissions(groupId: string, tenantId?: string) {
  return useQuery({
    queryKey: [...permissionGroupKeys.detail(groupId), 'permissions', tenantId],
    queryFn: () =>
      permissionService.getGroupPermissions(
        groupId,
        tenantId ? { tenantId } : undefined
      ),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000,
  })
}

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
      toast.success('Đã phân quyền cho nhóm thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể phân quyền: ${error.message}`)
    },
  })
}

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
      toast.success('Đã thu hồi quyền khỏi nhóm thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể thu hồi quyền: ${error.message}`)
    },
  })
}
