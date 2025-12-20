/**
 * Require Permission Component
 * Route guard that checks if user has required permission
 * Redirects to 403 Forbidden page if permission is denied
 */
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePermissions } from '@/context/permission-provider'

interface RequirePermissionProps {
  children: React.ReactNode
  /**
   * Resource to check permission for
   */
  resource: string
  /**
   * Action to check permission for
   */
  action: string
  /**
   * Redirect path when permission is denied
   * @default '/errors/403'
   */
  redirectTo?: string
}

/**
 * Route guard component that requires a specific permission
 * Use this to protect entire pages/routes
 *
 * @example
 * ```tsx
 * <RequirePermission resource="doctors" action="read">
 *   <DoctorsPage />
 * </RequirePermission>
 * ```
 */
export function RequirePermission({
  children,
  resource,
  action,
  redirectTo = '/errors/403',
}: RequirePermissionProps) {
  const { can, isLoaded } = usePermissions()
  const navigate = useNavigate()

  const hasPermission = isLoaded && can(resource, action)

  useEffect(() => {
    if (isLoaded && !hasPermission) {
      navigate({
        to: redirectTo,
        replace: true,
      })
    }
  }, [isLoaded, hasPermission, navigate, redirectTo])

  // Don't render content if permission denied
  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}

// ============================================================================
// Require Any Permission
// ============================================================================

interface RequireAnyPermissionProps {
  children: React.ReactNode
  /**
   * List of permissions to check (OR logic)
   */
  permissions: Array<{ resource: string; action: string }>
  /**
   * Redirect path when all permissions are denied
   * @default '/errors/403'
   */
  redirectTo?: string
}

/**
 * Route guard that requires ANY of the specified permissions
 */
export function RequireAnyPermission({
  children,
  permissions,
  redirectTo = '/errors/403',
}: RequireAnyPermissionProps) {
  const { canAny, isLoaded } = usePermissions()
  const navigate = useNavigate()

  const hasPermission = isLoaded && canAny(permissions)

  useEffect(() => {
    if (isLoaded && !hasPermission) {
      navigate({
        to: redirectTo,
        replace: true,
      })
    }
  }, [isLoaded, hasPermission, navigate, redirectTo])

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}

