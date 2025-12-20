/**
 * Sidebar Utilities
 * Helper functions for permission-based sidebar filtering
 */
import type { LinkProps } from '@tanstack/react-router'
import type { UserRole } from '@/api/types/auth.types'

// ============================================================================
// Legacy Types (for backward compatibility during migration)
// ============================================================================
// Types

/**
 * Permission requirement for a nav item
 */
export type NavPermission = {
  resource: string
  action: string
  /**
   * Optional role requirement - if specified, only these roles can access the item
   * Checked in addition to resource/action permissions
   */
  roleRequired?: UserRole[]
}

/**
 * Base navigation item structure
 */
type BaseNavItemWithPermission = {
  title: string
  badge?: string
  icon?: React.ElementType
  /**
   * Permission required to see this item
   * If not specified, item is visible to all authenticated users
   */
  permission?: NavPermission
}

/**
 * Navigation link with permission
 */
type NavLinkWithPermission = BaseNavItemWithPermission & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

/**
 * Navigation collapsible with permission
 */
type NavCollapsibleWithPermission = BaseNavItemWithPermission & {
  items: NavItemWithPermission[]
  url?: never
}

/**
 * Navigation item (link or collapsible)
 */
export type NavItemWithPermission =
  | NavCollapsibleWithPermission
  | NavLinkWithPermission

/**
 * Navigation group with permission
 */
export interface NavGroupWithPermission {
  title: string
  items: NavItemWithPermission[]
  /**
   * Permission required to see this group
   * If not specified, group visibility depends on its items
   */
  permission?: NavPermission
}

// ============================================================================
// Permission Check Functions
// ============================================================================

/**
 * Permission checker function type
 * Matches the signature from PermissionStore
 */
export type PermissionChecker = (resource: string, action: string) => boolean

/**
 * Check if user can access a nav item
 */
export function canAccessNavItem(
  item: NavItemWithPermission,
  can: PermissionChecker,
  userRole?: UserRole
): boolean {
  // If no permission specified, item is accessible
  if (!item.permission) {
    return true
  }

  // Check role requirement first
  if (item.permission.roleRequired && userRole) {
    if (!item.permission.roleRequired.includes(userRole)) {
      return false
    }
  }

  // Check permission
  return can(item.permission.resource, item.permission.action)
}

/**
 * Filter nav items based on permissions
 */
export function filterNavItems(
  items: NavItemWithPermission[],
  can: PermissionChecker,
  userRole?: UserRole
): NavItemWithPermission[] {
  return items
    .filter((item) => {
      // If item has sub-items, check if any sub-item is accessible
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterNavItems(item.items, can, userRole)
        // Parent is accessible if it has accessible children
        return filteredSubItems.length > 0
      }

      // For leaf items, check permission
      return canAccessNavItem(item, can, userRole)
    })
    .map((item) => {
      // If item has sub-items, filter them recursively
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterNavItems(item.items, can, userRole)

        return {
          ...item,
          items: filteredSubItems,
        }
      }

      return item
    })
}

/**
 * Filter nav groups based on permissions
 */
export function filterNavGroups(
  groups: NavGroupWithPermission[],
  can: PermissionChecker,
  userRole?: UserRole
): NavGroupWithPermission[] {
  return groups
    .map((group) => {
      // Check group-level permission if specified
      if (group.permission) {
        // Check role requirement first
        if (group.permission.roleRequired && userRole) {
          if (!group.permission.roleRequired.includes(userRole)) {
            return null
          }
        }

        const hasAccess = can(
          group.permission.resource,
          group.permission.action
        )
        if (!hasAccess) {
          return null
        }
      }

      // Filter items within the group
      const filteredItems = filterNavItems(group.items, can, userRole)

      // Only include group if it has accessible items
      if (filteredItems.length > 0) {
        return {
          ...group,
          items: filteredItems,
        }
      }

      return null
    })
    .filter((group): group is NavGroupWithPermission => group !== null)
}

// ============================================================================

// ============================================================================

/**
 * @deprecated Use NavItemWithPermission instead
 */
export type NavItemWithAccess = NavItemWithPermission & {
  allowedRoles?: UserRole[]
}

/**
 * @deprecated Use NavGroupWithPermission instead
 */
export interface NavGroupWithAccess extends NavGroupWithPermission {
  allowedRoles?: UserRole[]
}

/**
 * @deprecated Use canAccessNavItem with permission checker instead
 */
export function canAccessItem(
  userRole: UserRole | undefined,
  allowedRoles?: UserRole[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }

  if (!userRole) {
    return false
  }

  return allowedRoles.includes(userRole)
}
