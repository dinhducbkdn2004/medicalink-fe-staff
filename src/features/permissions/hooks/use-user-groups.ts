/**
 * User Groups Hook
 * Manages user-group memberships
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionService } from '@/api/services/permission.service'

// Query key factory
export const userGroupKeys = {
  all: ['user-groups'] as const,
  user: (userId: string, tenantId?: string) =>
    [...userGroupKeys.all, userId, { tenantId }] as const,
}

/**
 * Fetch groups that a user belongs to
 */
export function useUserGroups(userId: string, tenantId?: string) {
  return useQuery({
    queryKey: userGroupKeys.user(userId, tenantId),
    queryFn: () => permissionService.getUserGroups(userId, { tenantId }),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Add a user to a group
 */
export function useAddUserToGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      groupId,
      tenantId,
    }: {
      userId: string
      groupId: string
      tenantId?: string
    }) => permissionService.addUserToGroup(userId, { groupId, tenantId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userGroupKeys.user(variables.userId, variables.tenantId),
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
      toast.success('User added to group successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to add user to group: ${error.message}`)
    },
  })
}

/**
 * Remove a user from a group
 */
export function useRemoveUserFromGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      groupId,
      tenantId,
    }: {
      userId: string
      groupId: string
      tenantId?: string
    }) => permissionService.removeUserFromGroup(userId, groupId, tenantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userGroupKeys.user(variables.userId, variables.tenantId),
      })
      queryClient.invalidateQueries({ queryKey: ['permission-stats'] })
      queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
      toast.success('User removed from group successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove user from group: ${error.message}`)
    },
  })
}
