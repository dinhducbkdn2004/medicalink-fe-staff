
import { type ReactNode } from 'react'
import { usePermissions } from '@/context/permission-provider'





interface PermissionGateProps {
  children: ReactNode
  
  resource: string
  
  action: string
  
  fallback?: ReactNode
}


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





interface PermissionGateWithContextProps {
  children: ReactNode
  
  resource: string
  
  action: string
  
  context?: Record<string, unknown>
  
  fallback?: ReactNode
}


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





interface PermissionGateAnyProps {
  children: ReactNode
  
  permissions: Array<{ resource: string; action: string }>
  
  fallback?: ReactNode
}


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





interface PermissionGateAllProps {
  children: ReactNode
  
  permissions: Array<{ resource: string; action: string }>
  
  fallback?: ReactNode
}


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





interface CanProps {
  
  I?: string
  resource?: string
  action?: string
  
  context?: Record<string, unknown>
  
  children: ReactNode
  
  fallback?: ReactNode
}


export function Can({
  I,
  resource: resourceProp,
  action: actionProp,
  context,
  children,
  fallback = null,
}: CanProps) {
  const { can, canWithContext } = usePermissions()

  
  let resource = resourceProp
  let action = actionProp

  if (I) {
    const parts = I.split(':')
    if (parts.length === 2) {
      resource = parts[0]
      action = parts[1]
    }
  }

  
  if (!resource || !action) {
    console.warn('Can: resource and action are required')
    return <>{fallback}</>
  }

  
  const hasPermission = context
    ? canWithContext(resource, action, context)
    : can(resource, action)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

