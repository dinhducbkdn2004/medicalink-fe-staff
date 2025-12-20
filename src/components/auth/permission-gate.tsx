/**
 * Permission Gate Component
 * Conditionally renders children based on user permissions
 */
import { type ReactNode } from 'react'
import { usePermissions } from '@/context/permission-provider'

// ============================================================================
// Permission Gate - Basic
// ============================================================================

interface PermissionGateProps {
  children: ReactNode
  /**
   * Resource to check permission for
   */
  resource: string
  /**
   * Action to check permission for
   */
  action: string
  /**
   * Fallback to render if permission is denied
   */
  fallback?: ReactNode
}

/**
 * Renders children only if user has the specified permission
 * Uses UI-level check (does not evaluate conditions)
 */
export function PermissionGate({
  children,
  resource,
  action,
  fallback = null,
}: PermissionGateProps) {
  const { can } = usePermissions()

  if (!can(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// Permission Gate - With Context
// ============================================================================

interface PermissionGateWithContextProps {
  children: ReactNode
  /**
   * Resource to check permission for
   */
  resource: string
  /**
   * Action to check permission for
   */
  action: string
  /**
   * Context for condition evaluation
   */
  context?: Record<string, unknown>
  /**
   * Fallback to render if permission is denied
   */
  fallback?: ReactNode
}

/**
 * Renders children only if user has the specified permission with context
 * Evaluates conditions against the provided context
 */
export function PermissionGateWithContext({
  children,
  resource,
  action,
  context,
  fallback = null,
}: PermissionGateWithContextProps) {
  const { canWithContext } = usePermissions()

  if (!canWithContext(resource, action, context)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// Permission Gate - Any
// ============================================================================

interface PermissionGateAnyProps {
  children: ReactNode
  /**
   * List of permissions to check (OR logic)
   */
  permissions: Array<{ resource: string; action: string }>
  /**
   * Fallback to render if all permissions are denied
   */
  fallback?: ReactNode
}

/**
 * Renders children if user has ANY of the specified permissions
 */
export function PermissionGateAny({
  children,
  permissions,
  fallback = null,
}: PermissionGateAnyProps) {
  const { canAny } = usePermissions()

  if (!canAny(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// Permission Gate - All
// ============================================================================

interface PermissionGateAllProps {
  children: ReactNode
  /**
   * List of permissions to check (AND logic)
   */
  permissions: Array<{ resource: string; action: string }>
  /**
   * Fallback to render if any permission is denied
   */
  fallback?: ReactNode
}

/**
 * Renders children only if user has ALL of the specified permissions
 */
export function PermissionGateAll({
  children,
  permissions,
  fallback = null,
}: PermissionGateAllProps) {
  const { canAll } = usePermissions()

  if (!canAll(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// Can Component - Shorthand
// ============================================================================

interface CanProps {
  /**
   * Permission in format "resource:action" or separate resource/action
   */
  I?: string
  resource?: string
  action?: string
  /**
   * Context for condition evaluation (when provided, uses canWithContext)
   */
  context?: Record<string, unknown>
  /**
   * Content to render if permission is granted
   */
  children: ReactNode
  /**
   * Fallback to render if permission is denied
   */
  fallback?: ReactNode
}

/**
 * Shorthand permission gate component
 *
 * Usage:
 * <Can I="blogs:create">...</Can>
 * <Can resource="blogs" action="create">...</Can>
 * <Can I="blogs:update" context={{ isSelf: true }}>...</Can>
 */
export function Can({
  I,
  resource: resourceProp,
  action: actionProp,
  context,
  children,
  fallback = null,
}: CanProps) {
  const { can, canWithContext } = usePermissions()

  // Parse permission string if provided
  let resource = resourceProp
  let action = actionProp

  if (I) {
    const parts = I.split(':')
    if (parts.length === 2) {
      resource = parts[0]
      action = parts[1]
    }
  }

  // Validate
  if (!resource || !action) {
    console.warn('Can: resource and action are required')
    return <>{fallback}</>
  }

  // Check permission
  const hasPermission = context
    ? canWithContext(resource, action, context)
    : can(resource, action)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

