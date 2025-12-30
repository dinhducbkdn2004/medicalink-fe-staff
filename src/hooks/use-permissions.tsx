/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { permissionService } from '@/api/services/permission.service'
import { useAuthStore } from '@/stores/auth-store'
import {
  usePermissionStore,
  useIsPermissionLoaded,
  useIsPermissionLoading,
} from '@/stores/permission-store'

export const myPermissionKeys = {
  all: ['my-permissions'] as const,
  current: () => [...myPermissionKeys.all, 'current'] as const,
}

export function useMyPermissions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const actionsRef = useRef(usePermissionStore.getState())

  return useQuery({
    queryKey: [myPermissionKeys.current(), actionsRef.current],
    queryFn: async () => {
      const { setLoading, setPermissions, clearPermissions } =
        actionsRef.current
      setLoading(true)
      try {
        const permissions = await permissionService.getMyPermissions()
        setPermissions(permissions)
        return permissions
      } catch (error) {
        clearPermissions()
        throw error
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}

export function useCan(resource: string, action: string): boolean {
  const isLoaded = useIsPermissionLoaded()

  const permissionMap = usePermissionStore((state) => state.permissionMap)

  return useMemo(() => {
    if (!isLoaded) return false

    return usePermissionStore.getState().can(resource, action)
  }, [resource, action, isLoaded, permissionMap])
}

export function useCanWithContext(
  resource: string,
  action: string,
  context?: Record<string, unknown>
): boolean {
  const isLoaded = useIsPermissionLoaded()

  const permissionMap = usePermissionStore((state) => state.permissionMap)

  const contextKey = context ? JSON.stringify(context) : ''

  return useMemo(() => {
    if (!isLoaded) return false
    return usePermissionStore
      .getState()
      .canWithContext(resource, action, context)
  }, [resource, action, contextKey, isLoaded, permissionMap])
}

export function usePermissionChecker() {
  const isLoaded = useIsPermissionLoaded()
  const isLoading = useIsPermissionLoading()

  const permissionMap = usePermissionStore((state) => state.permissionMap)

  const can = useCallback(
    (resource: string, action: string) => {
      if (!isLoaded) return false
      return usePermissionStore.getState().can(resource, action)
    },

    [isLoaded, permissionMap]
  )

  const canWithContext = useCallback(
    (resource: string, action: string, context?: Record<string, unknown>) => {
      if (!isLoaded) return false
      return usePermissionStore
        .getState()
        .canWithContext(resource, action, context)
    },

    [isLoaded, permissionMap]
  )

  const canAny = useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      if (!isLoaded) return false
      const state = usePermissionStore.getState()
      return permissions.some((p) => state.can(p.resource, p.action))
    },

    [isLoaded, permissionMap]
  )

  const canAll = useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      if (!isLoaded) return false
      const state = usePermissionStore.getState()
      return permissions.every((p) => state.can(p.resource, p.action))
    },

    [isLoaded, permissionMap]
  )

  return useMemo(
    () => ({
      can,
      canWithContext,
      canAny,
      canAll,
      isLoaded,
      isLoading,
    }),
    [can, canWithContext, canAny, canAll, isLoaded, isLoading]
  )
}

export function useIsSystemAdmin(): boolean {
  return useCan('system', 'admin')
}

export function useCanManagePermissions(): boolean {
  return useCan('permissions', 'manage')
}
