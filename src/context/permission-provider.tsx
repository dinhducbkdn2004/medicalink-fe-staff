/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useAuthStore } from '@/stores/auth-store'
import {
  usePermissionStore,
  useIsPermissionLoaded,
  useIsPermissionLoading,
} from '@/stores/permission-store'
import { useMyPermissions } from '@/hooks/use-permissions'

interface PermissionContextValue {
  can: (resource: string, action: string) => boolean

  canWithContext: (
    resource: string,
    action: string,
    context?: Record<string, unknown>
  ) => boolean

  canAny: (permissions: Array<{ resource: string; action: string }>) => boolean

  canAll: (permissions: Array<{ resource: string; action: string }>) => boolean

  isLoaded: boolean

  isLoading: boolean

  refetch: () => void
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

export function usePermissions() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }

  return context
}

interface PermissionProviderProps {
  children: ReactNode

  showLoading?: boolean
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoaded = useIsPermissionLoaded()
  const isLoadingState = useIsPermissionLoading()

  const permissionMap = usePermissionStore((state) => state.permissionMap)
  const { isLoading: isQueryLoading, refetch } = useMyPermissions()

  const storeRef = useRef(usePermissionStore.getState())

  useEffect(() => {
    if (!isAuthenticated) {
      storeRef.current.clearPermissions()
    }
  }, [isAuthenticated])

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

  const isLoading = isLoadingState || isQueryLoading

  const contextValue = useMemo<PermissionContextValue>(
    () => ({
      can,
      canWithContext,
      canAny,
      canAll,
      isLoaded,
      isLoading,
      refetch,
    }),
    [can, canWithContext, canAny, canAll, isLoaded, isLoading, refetch]
  )

  if (isAuthenticated && !isLoaded && isLoading) {
    return null
  }

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  )
}
