/**
 * Permission Badge Component
 * Visual indicators for permission states and sources
 */
import { Shield, Users, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type PermissionBadgeProps = {
  granted: boolean
  source?: 'direct' | 'group'
  groupName?: string
  conditional?: boolean
  className?: string
}

export function PermissionBadge({
  granted,
  source,
  groupName,
  conditional,
  className,
}: PermissionBadgeProps) {
  if (!granted) {
    return (
      <Badge variant='destructive' className={cn('gap-1', className)}>
        <AlertCircle className='h-3 w-3' />
        Denied
      </Badge>
    )
  }

  if (source === 'direct') {
    return (
      <Badge variant='default' className={cn('gap-1 bg-green-600', className)}>
        <Shield className='h-3 w-3' />
        Direct
        {conditional && <span className='text-xs'>(Conditional)</span>}
      </Badge>
    )
  }

  if (source === 'group') {
    return (
      <Badge
        variant='secondary'
        className={cn('gap-1 bg-blue-600 text-white', className)}
      >
        <Users className='h-3 w-3' />
        Group: {groupName || 'Unknown'}
      </Badge>
    )
  }

  return (
    <Badge variant='default' className={cn('gap-1 bg-green-600', className)}>
      <Shield className='h-3 w-3' />
      Granted
    </Badge>
  )
}

type PermissionStatusBadgeProps = {
  isActive: boolean
  className?: string
}

export function PermissionStatusBadge({
  isActive,
  className,
}: PermissionStatusBadgeProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(isActive ? 'bg-green-600' : 'bg-gray-400', className)}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}
