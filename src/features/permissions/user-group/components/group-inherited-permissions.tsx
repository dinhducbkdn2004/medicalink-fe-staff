import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { GroupPermission, Permission } from '@/api/types/permission.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  groupCatalogByModule,
  formatResourceLabel,
} from '../../utils/permission-catalog'
import { useGroupPermissions } from '../../hooks'

type GroupInheritedPermissionsProps = {
  groupId: string
  tenantId?: string
  catalog: Permission[]
}

/** Read-only tree — shows the live catalog slice for one group. */
export function GroupInheritedPermissions({
  groupId,
  tenantId,
  catalog,
}: GroupInheritedPermissionsProps) {
  const { data: assigned, isLoading } = useGroupPermissions(groupId, tenantId)
  const [open, setOpen] = useState(false)

  const modules = useMemo(() => {
    if (!assigned?.length) return []
    const keys = new Set(assigned.map((p) => `${p.resource}:${p.action}`))
    const slice = catalog.filter((p) => keys.has(`${p.resource}:${p.action}`))
    return groupCatalogByModule(slice)
  }, [assigned, catalog])

  const assignedMap = useMemo(() => {
    const m = new Map<string, GroupPermission>()
    for (const p of assigned ?? []) {
      m.set(`${p.resource}:${p.action}`, p)
    }
    return m
  }, [assigned])

  if (isLoading) {
    return <Skeleton className='h-16 w-full' />
  }

  if (!assigned?.length) {
    return (
      <p className='text-muted-foreground px-1 py-2 text-xs'>
        This group has no permissions assigned yet.
      </p>
    )
  }

  return (
    <div className='border-muted mt-2 rounded-md border'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='hover:bg-muted/40 flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium'
      >
        <span className='flex items-center gap-1'>
          {open ? <ChevronDown className='h-3.5 w-3.5' /> : <ChevronRight className='h-3.5 w-3.5' />}
          Permissions from this group
        </span>
        <Badge variant='secondary' className='text-[10px]'>
          {assigned.length}
        </Badge>
      </button>
      {open && (
        <div className='max-h-64 space-y-2 overflow-y-auto border-t px-2 py-2'>
          {modules.map((mod) => (
            <div key={mod.moduleId} className='rounded border bg-muted/10 px-2 py-1.5'>
              <div className='text-muted-foreground mb-1 text-[10px] font-semibold tracking-wide uppercase'>
                {mod.meta.title}
              </div>
              {mod.resources.map(({ resource, permissions }) => (
                <div key={resource} className='mb-1.5 last:mb-0'>
                  <div className='text-xs font-medium capitalize'>
                    {formatResourceLabel(resource)}
                  </div>
                  <ul className='mt-1 space-y-0.5 pl-2'>
                    {permissions.map((p) => {
                      const row = assignedMap.get(`${p.resource}:${p.action}`)
                      const allowed = row?.effect === 'ALLOW'
                      return (
                        <li
                          key={p.id}
                          className='flex items-center gap-2 text-[11px]'
                        >
                          <span
                            className={cn(
                              'inline-block h-2 w-2 shrink-0 rounded-full',
                              allowed ? 'bg-green-600' : 'bg-destructive'
                            )}
                          />
                          <span className='capitalize'>{p.action}</span>
                          {row?.conditions && row.conditions.length > 0 && (
                            <Badge variant='outline' className='h-[18px] px-1 text-[9px]'>
                              Conditional
                            </Badge>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
