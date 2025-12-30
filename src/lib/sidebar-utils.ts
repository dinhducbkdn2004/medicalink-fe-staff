import type { LinkProps } from '@tanstack/react-router'
import type { UserRole } from '@/api/types/auth.types'

export type NavPermission = {
  resource: string
  action: string

  roleRequired?: UserRole[]
}

type BaseNavItemWithPermission = {
  title: string
  badge?: string
  icon?: React.ElementType

  permission?: NavPermission
}

type NavLinkWithPermission = BaseNavItemWithPermission & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsibleWithPermission = BaseNavItemWithPermission & {
  items: NavItemWithPermission[]
  url?: never
}

export type NavItemWithPermission =
  | NavCollapsibleWithPermission
  | NavLinkWithPermission

export interface NavGroupWithPermission {
  title: string
  items: NavItemWithPermission[]

  permission?: NavPermission
}

export type PermissionChecker = (resource: string, action: string) => boolean

export function canAccessNavItem(
  item: NavItemWithPermission,
  can: PermissionChecker,
  userRole?: UserRole
): boolean {
  if (!item.permission) {
    return true
  }

  if (item.permission.roleRequired && userRole) {
    if (!item.permission.roleRequired.includes(userRole)) {
      return false
    }
  }

  return can(item.permission.resource, item.permission.action)
}

export function filterNavItems(
  items: NavItemWithPermission[],
  can: PermissionChecker,
  userRole?: UserRole
): NavItemWithPermission[] {
  return items
    .filter((item) => {
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterNavItems(item.items, can, userRole)

        return filteredSubItems.length > 0
      }

      return canAccessNavItem(item, can, userRole)
    })
    .map((item) => {
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

export function filterNavGroups(
  groups: NavGroupWithPermission[],
  can: PermissionChecker,
  userRole?: UserRole
): NavGroupWithPermission[] {
  return groups
    .map((group) => {
      if (group.permission) {
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

      const filteredItems = filterNavItems(group.items, can, userRole)

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

export type NavItemWithAccess = NavItemWithPermission & {
  allowedRoles?: UserRole[]
}

export interface NavGroupWithAccess extends NavGroupWithPermission {
  allowedRoles?: UserRole[]
}

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
