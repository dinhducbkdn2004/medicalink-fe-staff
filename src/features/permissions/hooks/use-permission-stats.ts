/**
 * Permission Stats Hook
 * Fetches and caches permission statistics
 */
import { useQuery } from '@tanstack/react-query'
import { permissionService } from '@/api/services/permission.service'

export function usePermissionStats() {
  return useQuery({
    queryKey: ['permission-stats'],
    queryFn: () => permissionService.getPermissionStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
