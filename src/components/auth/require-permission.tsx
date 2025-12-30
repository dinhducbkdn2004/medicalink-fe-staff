
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePermissions } from '@/context/permission-provider'

interface RequirePermissionProps {
  children: React.ReactNode
  
  resource: string
  
  action: string
  
  redirectTo?: string
}


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

  
  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}





interface RequireAnyPermissionProps {
  children: React.ReactNode
  
  permissions: Array<{ resource: string; action: string }>
  
  redirectTo?: string
}


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

