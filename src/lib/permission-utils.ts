/**
 * Permission Utilities
 * Helper functions for permission checking
 * Used outside of React components
 */
import { usePermissionStore } from '@/stores/permission-store'

/**
 * Check if user has permission (UI level)
 * Can be used outside React components
 */
export function can(resource: string, action: string): boolean {
  return usePermissionStore.getState().can(resource, action)
}

/**
 * Check if user has permission with context (Action level)
 * Can be used outside React components
 */
export function canWithContext(
  resource: string,
  action: string,
  context?: Record<string, unknown>
): boolean {
  return usePermissionStore.getState().canWithContext(resource, action, context)
}

/**
 * Check if user has any of the specified permissions
 */
export function canAny(
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.some((p) => can(p.resource, p.action))
}

/**
 * Check if user has all of the specified permissions
 */
export function canAll(
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.every((p) => can(p.resource, p.action))
}

/**
 * Check if user has system admin access
 * This is a special permission for super admin
 */
export function isSystemAdmin(): boolean {
  return can('system', 'admin')
}

/**
 * Check if user can manage permissions
 */
export function canManagePermissions(): boolean {
  return can('permissions', 'manage')
}

/**
 * Permission for a route/page
 */
export type RoutePermission = {
  resource: string
  action: string
}

/**
 * Get required permission for a route path
 */
export function getRoutePermission(path: string): RoutePermission | null {
  // Remove leading slash and split
  const segments = path.replace(/^\//, '').split('/')
  const baseSegment = segments[0]

  // Map routes to permissions
  const routePermissionMap: Record<string, RoutePermission> = {
    // Dashboard
    '': { resource: 'dashboard', action: 'read' },

    // User Management
    staffs: { resource: 'staff', action: 'read' },
    doctors: { resource: 'doctors', action: 'read' },
    patients: { resource: 'patients', action: 'read' },

    // Permissions (system admin only)
    'group-manager': { resource: 'permissions', action: 'manage' },
    'user-permission': { resource: 'permissions', action: 'manage' },
    'user-group': { resource: 'groups', action: 'manage' },

    // Hospital Configuration
    specialties: { resource: 'specialties', action: 'read' },
    'work-locations': { resource: 'work-locations', action: 'read' },
    'office-hours': { resource: 'office-hours', action: 'read' },

    // Operations
    appointments: { resource: 'appointments', action: 'read' },
    questions: { resource: 'questions', action: 'read' },
    reviews: { resource: 'reviews', action: 'read' },

    // Content
    blogs: { resource: 'blogs', action: 'read' },

    // Notifications
    notifications: { resource: 'notifications', action: 'read' },

    // Schedules
    schedules: { resource: 'schedules', action: 'read' },

    // Settings - always accessible to authenticated users
    settings: null as unknown as RoutePermission,
    'help-center': null as unknown as RoutePermission,
  }

  return routePermissionMap[baseSegment] ?? null
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(path: string): boolean {
  const permission = getRoutePermission(path)

  // No permission required (public authenticated route)
  if (permission === null) {
    return true
  }

  return can(permission.resource, permission.action)
}
