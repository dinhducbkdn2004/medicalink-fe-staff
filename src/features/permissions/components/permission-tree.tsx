
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { RESOURCES, ACTIONS, type GroupPermission } from '@/api/types/permission.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

type PermissionTreeProps = {
  permissions: GroupPermission[]
  onPermissionChange?: (
    resource: string,
    action: string,
    granted: boolean
  ) => void
  readOnly?: boolean
}

type PermissionNode = {
  resource: string
  actions: {
    action: string
    granted: boolean
    effect?: 'ALLOW' | 'DENY'
    conditions?: unknown[] | null
  }[]
}

export function PermissionTree({
  permissions,
  onPermissionChange,
  readOnly = false,
}: PermissionTreeProps) {
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set(RESOURCES)
  )

  
  const permissionNodes: PermissionNode[] = RESOURCES.map((resource) => {
    const resourcePermissions = permissions.filter(
      (p) => p.resource === resource
    )
    return {
      resource,
      actions: ACTIONS.map((action) => {
        const perm = resourcePermissions.find((p) => p.action === action)
        return {
          action,
          granted: perm?.effect === 'ALLOW',
          effect: perm?.effect,
          conditions: perm?.conditions,
        }
      }),
    }
  })

  const toggleResource = (resource: string) => {
    const newExpanded = new Set(expandedResources)
    if (newExpanded.has(resource)) {
      newExpanded.delete(resource)
    } else {
      newExpanded.add(resource)
    }
    setExpandedResources(newExpanded)
  }

  const handlePermissionToggle = (
    resource: string,
    action: string,
    granted: boolean
  ) => {
    if (!readOnly && onPermissionChange) {
      onPermissionChange(resource, action, !granted)
    }
  }

  const getResourceGrantedCount = (node: PermissionNode) => {
    return node.actions.filter((a) => a.granted).length
  }

  return (
    <div className='space-y-2 rounded-lg border p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>Resources & Permissions</h3>
        <p className='text-muted-foreground text-xs'>
          {permissions.filter((p) => p.granted).length} permissions granted
        </p>
      </div>

      {permissionNodes.map((node) => {
        const isExpanded = expandedResources.has(node.resource)
        const grantedCount = getResourceGrantedCount(node)

        return (
          <div key={node.resource} className='rounded-md border'>
            {}
            <button
              onClick={() => toggleResource(node.resource)}
              className='hover:bg-muted/50 flex w-full items-center justify-between p-3 text-left transition-colors'
            >
              <div className='flex items-center gap-2'>
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
                <span className='font-medium capitalize'>{node.resource}</span>
                {grantedCount > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {grantedCount}/{node.actions.length}
                  </Badge>
                )}
              </div>
            </button>

            {}
            {isExpanded && (
              <div className='bg-muted/20 border-t p-3'>
                <div className='space-y-2'>
                  {node.actions.map((action) => (
                    <div
                      key={action.action}
                      className={cn(
                        'flex items-center justify-between rounded-md p-2',
                        action.granted && 'bg-green-50 dark:bg-green-950/20'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          checked={action.granted}
                          onCheckedChange={() =>
                            handlePermissionToggle(
                              node.resource,
                              action.action,
                              action.granted
                            )
                          }
                          disabled={readOnly}
                        />
                        <span className='text-sm capitalize'>
                          {action.action}
                        </span>
                        {action.conditions && (
                          <Badge variant='outline' className='text-xs'>
                            Conditional
                          </Badge>
                        )}
                      </div>
                      {action.effect && (
                        <Badge
                          variant={action.effect === 'ALLOW' ? 'default' : 'destructive'}
                          className={cn(
                            'text-xs',
                            action.effect === 'ALLOW' && 'bg-green-600'
                          )}
                        >
                          {action.effect}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
