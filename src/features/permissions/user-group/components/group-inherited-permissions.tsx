import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Check, X } from 'lucide-react'
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
        Nhóm này chưa được gán quyền nào.
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
          Các quyền từ nhóm này
        </span>
        <Badge variant='secondary' className='text-[10px]'>
          {assigned.length}
        </Badge>
      </button>
      {open && (
        <div className='max-h-[300px] space-y-3 overflow-y-auto border-t px-3 py-3'>
          {modules.map((mod) => (
            <div key={mod.moduleId} className='space-y-2'>
              <div className='text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase'>
                <span>{mod.meta.title}</span>
                <div className='h-px flex-1 bg-border/50' />
              </div>
              <div className='grid gap-2 sm:grid-cols-2'>
                {mod.resources.map(({ resource, permissions }) => (
                  <div
                    key={resource}
                    className='rounded-md border bg-muted/20 p-2.5 transition-colors hover:bg-muted/30'
                  >
                    <div className='mb-2 flex items-center gap-1.5 text-xs font-medium capitalize text-foreground'>
                      <ChevronRight className='h-3 w-3 text-muted-foreground' />
                      {formatResourceLabel(resource)}
                    </div>
                    <div className='flex flex-wrap gap-1.5 pl-4'>
                      {permissions.map((p) => {
                        const row = assignedMap.get(`${p.resource}:${p.action}`)
                        const allowed = row?.effect === 'ALLOW'
                        const hasConditions = row?.conditions && row.conditions.length > 0
                        return (
                          <Badge
                            key={p.id}
                            variant='outline'
                            className={cn(
                              'flex items-center gap-1.5 border px-1.5 py-0.5 text-[10px] font-normal transition-colors',
                              allowed
                                ? 'border-green-200/50 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400'
                                : 'border-destructive/20 bg-destructive/5 text-destructive'
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                allowed ? 'bg-green-500' : 'bg-destructive'
                              )}
                            />
                            <span className='capitalize leading-none'>{p.action}</span>
                            {hasConditions && (
                              <span
                                className='ml-0.5 border-l pl-1.5 text-[9px] opacity-70'
                                title='Có điều kiện'
                              >
                                {row.conditions.length} đ.k
                              </span>
                            )}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
