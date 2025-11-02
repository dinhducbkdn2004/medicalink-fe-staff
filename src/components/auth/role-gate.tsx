/**
 * Role Gate Component
 * Conditionally renders children based on user role
 */
import type { UserRole } from '@/api/types/auth.types'
import { hasAnyRole } from '@/lib/auth-utils'
import { useAuth } from '@/hooks/use-auth'

interface RoleGateProps {
  children: React.ReactNode
  roles: UserRole[]
  fallback?: React.ReactNode
}

/**
 * Renders children only if user has one of the specified roles
 */
export function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const { user } = useAuth()

  if (!hasAnyRole(user, roles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
