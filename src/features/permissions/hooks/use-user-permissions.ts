import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionService } from '@/api/services/permission.service'
import type {
  AssignUserPermissionRequest,
  RevokeUserPermissionRequest,
} from '@/api/types/permission.types'

export const userPermissionKeys = {
  all: ['user-permissions'] as const,
  user: (userId: string, tenantId?: string) =>
    [...userPermissionKeys.all, userId, { tenantId }] as const,
}

export function useUserPermissions(userId: string, tenantId?: string) {
  return useQuery({
    queryKey: userPermissionKeys.user(userId, tenantId),
    queryFn: () => permissionService.getUserPermissions(userId, { tenantId }),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  })
}

export function useAssignUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignUserPermissionRequest) =>
      permissionService.assignUserPermission(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userPermissionKeys.all, variables.userId],
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Đã cấp quyền cho người dùng thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể cấp quyền: ${error.message}`)
    },
  })
}

export function useRevokeUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RevokeUserPermissionRequest) =>
      permissionService.revokeUserPermission(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userPermissionKeys.user(variables.userId, variables.tenantId),
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Đã thu hồi quyền của người dùng thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể thu hồi quyền: ${error.message}`)
    },
  })
}

export function useRefreshUserPermissionCache() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, tenantId }: { userId: string; tenantId?: string }) =>
      permissionService.refreshUserPermissionCache(userId, tenantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userPermissionKeys.user(variables.userId, variables.tenantId),
      })
      toast.success('Đã làm mới bộ nhớ đệm quyền thành công')
    },
    onError: (error: Error) => {
      toast.error(`Không thể làm mới bộ nhớ đệm: ${error.message}`)
    },
  })
}
