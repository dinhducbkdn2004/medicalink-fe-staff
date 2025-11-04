/**
 * Sidebar Utilities
 * Helper functions for role-based sidebar filtering
 */
import type { LinkProps } from '@tanstack/react-router'
import type { UserRole } from '@/api/types/auth.types'

/**
 * Base navigation item structure
 */
type BaseNavItemWithAccess = {
  title: string
  badge?: string
  icon?: React.ElementType
  allowedRoles?: UserRole[]
}

/**
 * Navigation link with role-based access
 */
type NavLinkWithAccess = BaseNavItemWithAccess & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

/**
 * Navigation collapsible with role-based access
 */
type NavCollapsibleWithAccess = BaseNavItemWithAccess & {
  items: NavItemWithAccess[]
  url?: never
}

/**
 * Navigation item (link or collapsible)
 */
export type NavItemWithAccess = NavCollapsibleWithAccess | NavLinkWithAccess

/**
 * Navigation group with role-based access
 */
export interface NavGroupWithAccess {
  title: string
  items: NavItemWithAccess[]
  allowedRoles?: UserRole[]
}

/**
 * Check if user role is allowed to access an item
 */
export function canAccessItem(
  userRole: UserRole | undefined,
  allowedRoles?: UserRole[]
): boolean {
  // If no roles specified, everyone can access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }

  // If user has no role, deny access
  if (!userRole) {
    return false
  }

  // Check if user role is in allowed roles
  return allowedRoles.includes(userRole)
}

/**
 * Filter nav items based on user role
 */
export function filterNavItems(
  items: NavItemWithAccess[],
  userRole: UserRole | undefined
): NavItemWithAccess[] {
  return items
    .filter((item) => canAccessItem(userRole, item.allowedRoles))
    .map((item) => {
      // If item has sub-items, filter them recursively
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterNavItems(item.items, userRole)

        // Only include parent item if it has accessible sub-items
        if (filteredSubItems.length > 0) {
          return {
            ...item,
            items: filteredSubItems,
          }
        }

        // Parent item has no accessible sub-items, exclude it
        return null
      }

      return item
    })
    .filter((item): item is NavItemWithAccess => item !== null)
}

/**
 * Filter nav groups based on user role
 */
export function filterNavGroups(
  groups: NavGroupWithAccess[],
  userRole: UserRole | undefined
): NavGroupWithAccess[] {
  return groups
    .map((group) => {
      const filteredItems = filterNavItems(group.items, userRole)

      // Only include group if it has accessible items
      if (filteredItems.length > 0) {
        return {
          ...group,
          items: filteredItems,
        }
      }

      return null
    })
    .filter((group): group is NavGroupWithAccess => group !== null)
}
