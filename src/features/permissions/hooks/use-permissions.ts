/**
 * Permissions Hook
 * Fetches available system permissions
 */
import { useQuery } from '@tanstack/react-query'
import { permissionService } from '@/api/services/permission.service'

// Query key factory
export const permissionKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionKeys.all, 'list'] as const,
}

/**
 * Fetch all available system permissions
 */
export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () => permissionService.getPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
