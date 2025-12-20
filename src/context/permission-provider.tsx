/**
 * Permission Provider
 * Loads and manages user permissions after authentication
 * Wraps the application to provide permission context
 */
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

// ============================================================================
// Context Types
// ============================================================================

interface PermissionContextValue {
  /**
   * Check if user has permission for resource:action (UI level)
   * Does not evaluate conditions
   */
  can: (resource: string, action: string) => boolean

  /**
   * Check if user has permission with context (Action level)
   * Evaluates conditions against provided context
   */
  canWithContext: (
    resource: string,
    action: string,
    context?: Record<string, unknown>
  ) => boolean

  /**
   * Check if user has any of the specified permissions
   */
  canAny: (permissions: Array<{ resource: string; action: string }>) => boolean

  /**
   * Check if user has all of the specified permissions
   */
  canAll: (permissions: Array<{ resource: string; action: string }>) => boolean

  /**
   * Whether permissions are loaded
   */
  isLoaded: boolean

  /**
   * Whether permissions are loading
   */
  isLoading: boolean

  /**
   * Refresh permissions from API
   */
  refetch: () => void
}

// ============================================================================
// Context
// ============================================================================

const PermissionContext = createContext<PermissionContextValue | null>(null)

// ============================================================================
// Hook
// ============================================================================

/**
 * Use permission context
 * Must be used within PermissionProvider
 */
export function usePermissions() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }

  return context
}

// ============================================================================
// Provider
// ============================================================================

interface PermissionProviderProps {
  children: ReactNode
  /**
   * Show loading spinner while permissions are loading
   * @default true
   */
  showLoading?: boolean
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoaded = useIsPermissionLoaded()
  const isLoadingState = useIsPermissionLoading()
  // Subscribe to permissionMap changes to ensure callbacks update when permissions change
  const permissionMap = usePermissionStore((state) => state.permissionMap)
  const { isLoading: isQueryLoading, refetch } = useMyPermissions()

  // Use ref to get stable reference to store actions
  const storeRef = useRef(usePermissionStore.getState())

  // Clear permissions when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      storeRef.current.clearPermissions()
    }
  }, [isAuthenticated])

  // Create stable callback functions
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
      return usePermissionStore
        .getState()
        .canWithContext(resource, action, context)
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

  const isLoading = isLoadingState || isQueryLoading

  // Memoize context value
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

  // Show loading state while permissions are being fetched on initial load
  // Only show loader if authenticated and permissions haven't been loaded yet
  if (isAuthenticated && !isLoaded && isLoading) {
    return null // Return null instead of loader to prevent flash
  }

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  )
}
