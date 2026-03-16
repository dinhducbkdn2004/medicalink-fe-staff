import { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { canAccessRoute } from '@/lib/permission-utils'
import { usePermissions } from '@/context/permission-provider'

interface RbacGuardProps {
  children: React.ReactNode
}

export function RbacGuard({ children }: RbacGuardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoaded } = usePermissions()

  useEffect(() => {
    if (isLoaded) {
      if (!canAccessRoute(location.pathname)) {
        navigate({
          to: '/403',
          search: { redirect: location.href },
          replace: true,
        })
      }
    }
  }, [isLoaded, location.pathname, location.href, navigate])

  if (!isLoaded || !canAccessRoute(location.pathname)) {
    return null
  }

  return <>{children}</>
}
