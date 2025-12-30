import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionService } from '@/api/services/permission.service'
import type {
  CreatePermissionGroupRequest,
  UpdatePermissionGroupRequest,
} from '@/api/types/permission.types'

export const permissionGroupKeys = {
  all: ['permission-groups'] as const,
  lists: () => [...permissionGroupKeys.all, 'list'] as const,
  list: (tenantId?: string) =>
    [...permissionGroupKeys.lists(), { tenantId }] as const,
  details: () => [...permissionGroupKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionGroupKeys.details(), id] as const,
}

export function usePermissionGroups(tenantId?: string) {
  return useQuery({
    queryKey: permissionGroupKeys.list(tenantId),
    queryFn: () => permissionService.getPermissionGroups({ tenantId }),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreatePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePermissionGroupRequest) =>
      permissionService.createPermissionGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionGroupKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Permission group created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create group: ${error.message}`)
    },
  })
}

export function useUpdatePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string
      data: UpdatePermissionGroupRequest
    }) => permissionService.updatePermissionGroup(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionGroupKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: permissionGroupKeys.detail(variables.groupId),
      })
      toast.success('Permission group updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update group: ${error.message}`)
    },
  })
}

export function useDeletePermissionGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) =>
      permissionService.deletePermissionGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionGroupKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      toast.success('Permission group deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete group: ${error.message}`)
    },
  })
}
