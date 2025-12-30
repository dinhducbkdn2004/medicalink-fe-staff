import { useQuery } from '@tanstack/react-query'
import { permissionService } from '@/api/services/permission.service'

export const permissionKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionKeys.all, 'list'] as const,
}

export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () => permissionService.getPermissions(),
    staleTime: 5 * 60 * 1000,
  })
}
