/**
 * Permission React Hooks
 * Provides hooks for permission checking in React components
 */
import { useCallback, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { permissionService } from '@/api/services/permission.service'
import { useAuthStore } from '@/stores/auth-store'
import {
  usePermissionStore,
  useIsPermissionLoaded,
  useIsPermissionLoading,
} from '@/stores/permission-store'

// ============================================================================
// Query Keys
// ============================================================================

export const myPermissionKeys = {
  all: ['my-permissions'] as const,
  current: () => [...myPermissionKeys.all, 'current'] as const,
}

// ============================================================================
// Query Hook - Fetch My Permissions
// ============================================================================

/**
 * Fetch current user's permissions from API
 * Automatically stores in permission store
 */
export function useMyPermissions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  // Get stable references to actions
  const actionsRef = useRef(usePermissionStore.getState())

  return useQuery({
    queryKey: myPermissionKeys.current(),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

// ============================================================================
// Permission Check Hooks
// ============================================================================

/**
 * Hook to check if user has permission (UI level)
 * Returns memoized check result
 */
export function useCan(resource: string, action: string): boolean {
  const isLoaded = useIsPermissionLoaded()
  // Subscribe to permissionMap changes
  const permissionMap = usePermissionStore((state) => state.permissionMap)

  return useMemo(() => {
    if (!isLoaded) return false
    // Get state directly to avoid selector creating new objects
    return usePermissionStore.getState().can(resource, action)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, action, isLoaded, permissionMap])
}

/**
 * Hook to check permission with context (Action level)
 * Returns memoized check result
 */
export function useCanWithContext(
  resource: string,
  action: string,
  context?: Record<string, unknown>
): boolean {
  const isLoaded = useIsPermissionLoaded()
  // Subscribe to permissionMap changes
  const permissionMap = usePermissionStore((state) => state.permissionMap)
  // Stringify context for stable dependency
  const contextKey = context ? JSON.stringify(context) : ''

  return useMemo(() => {
    if (!isLoaded) return false
    return usePermissionStore.getState().canWithContext(resource, action, context)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, action, contextKey, isLoaded, permissionMap])
}

/**
 * Hook to get can and canWithContext functions
 * Useful when you need to check multiple permissions
 */
export function usePermissionChecker() {
  const isLoaded = useIsPermissionLoaded()
  const isLoading = useIsPermissionLoading()
  // Subscribe to permissionMap changes
  const permissionMap = usePermissionStore((state) => state.permissionMap)

  const can = useCallback(
    (resource: string, action: string) => {
      if (!isLoaded) return false
      return usePermissionStore.getState().can(resource, action)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded, permissionMap]
  )

  const canWithContext = useCallback(
    (resource: string, action: string, context?: Record<string, unknown>) => {
      if (!isLoaded) return false
      return usePermissionStore.getState().canWithContext(resource, action, context)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded, permissionMap]
  )

  const canAny = useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      if (!isLoaded) return false
      const state = usePermissionStore.getState()
      return permissions.some((p) => state.can(p.resource, p.action))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded, permissionMap]
  )

  const canAll = useCallback(
    (permissions: Array<{ resource: string; action: string }>) => {
      if (!isLoaded) return false
      const state = usePermissionStore.getState()
      return permissions.every((p) => state.can(p.resource, p.action))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

/**
 * Hook to check if user is system admin
 */
export function useIsSystemAdmin(): boolean {
  return useCan('system', 'admin')
}

/**
 * Hook to check if user can manage permissions
 */
export function useCanManagePermissions(): boolean {
  return useCan('permissions', 'manage')
}

