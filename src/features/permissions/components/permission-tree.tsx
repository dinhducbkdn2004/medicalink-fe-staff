import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import type { GroupPermission, Permission } from '@/api/types/permission.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  groupCatalogByModule,
  formatResourceLabel,
} from '../utils/permission-catalog'

type PermissionTreeProps = {
  /** Full permission catalog from `/permissions` */
  catalog: Permission[]
  /** Permissions currently granted on the group / context */
  assigned: GroupPermission[]
  onPermissionChange?: (
    resource: string,
    action: string,
    granted: boolean
  ) => void
  readOnly?: boolean
}

export function PermissionTree({
  catalog,
  assigned,
  onPermissionChange,
  readOnly = false,
}: PermissionTreeProps) {
  const [query, setQuery] = useState('')
  const [openModules, setOpenModules] = useState<Set<string>>(() => new Set())
  const [openResources, setOpenResources] = useState<Set<string>>(() => new Set())

  const assignedByKey = useMemo(() => {
    const map = new Map<string, GroupPermission>()
    for (const p of assigned) {
      map.set(`${p.resource}:${p.action}`, p)
    }
    return map
  }, [assigned])

  const grantedAllowCount = useMemo(
    () => assigned.filter((p) => p.effect === 'ALLOW').length,
    [assigned]
  )

  const modules = useMemo(
    () => groupCatalogByModule(catalog),
    [catalog]
  )

  const q = query.trim().toLowerCase()

  const filteredModules = useMemo(() => {
    if (!q) return modules
    return modules
      .map((mod) => ({
        ...mod,
        resources: mod.resources
          .map((r) => ({
            ...r,
            permissions: r.permissions.filter((p) => {
              const hay = `${p.resource} ${p.action} ${p.description ?? ''}`.toLowerCase()
              return hay.includes(q)
            }),
          }))
          .filter((r) => r.permissions.length > 0),
      }))
      .filter((m) => m.resources.length > 0)
  }, [modules, q])

  const toggleModule = (id: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleResource = (resource: string) => {
    setOpenResources((prev) => {
      const next = new Set(prev)
      if (next.has(resource)) next.delete(resource)
      else next.add(resource)
      return next
    })
  }

  const handleToggle = (resource: string, action: string, currentlyGranted: boolean) => {
    if (!readOnly && onPermissionChange) {
      onPermissionChange(resource, action, currentlyGranted)
    }
  }

  return (
    <div className='space-y-3 rounded-lg border p-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-sm font-semibold'>Permissions by module</h3>
          <p className='text-muted-foreground text-xs'>
            {grantedAllowCount} ALLOW grants enabled · tree matches the live catalog
          </p>
        </div>
      </div>

      <div className='relative'>
        <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
        <Input
          placeholder='Search resource, action, description…'
          className='h-9 pl-8'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className='max-h-[min(520px,60vh)] space-y-2 overflow-y-auto pr-1'>
        {filteredModules.map((mod) => {
          const modGranted = mod.resources.reduce((acc, r) => {
            for (const p of r.permissions) {
              const row = assignedByKey.get(`${p.resource}:${p.action}`)
              if (row?.effect === 'ALLOW') acc += 1
            }
            return acc
          }, 0)
          const modTotal = mod.resources.reduce((acc, r) => acc + r.permissions.length, 0)
          const isOpen = openModules.has(mod.moduleId) || !!q

          return (
            <div key={mod.moduleId} className='rounded-md border bg-card'>
              <button
                type='button'
                onClick={() => toggleModule(mod.moduleId)}
                className='hover:bg-muted/50 flex w-full items-center justify-between gap-2 p-3 text-left'
              >
                <div className='flex min-w-0 items-center gap-2'>
                  {isOpen ? (
                    <ChevronDown className='h-4 w-4 shrink-0' />
                  ) : (
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  )}
                  <div className='min-w-0'>
                    <div className='truncate text-sm font-medium'>{mod.meta.title}</div>
                    {mod.meta.description && (
                      <div className='text-muted-foreground truncate text-xs'>
                        {mod.meta.description}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant='secondary' className='shrink-0 text-xs'>
                  {modGranted}/{modTotal}
                </Badge>
              </button>

              {isOpen && (
                <div className='border-t px-2 pb-2'>
                  {mod.resources.map(({ resource, permissions }) => {
                    const resGranted = permissions.filter(
                      (p) =>
                        assignedByKey.get(`${p.resource}:${p.action}`)?.effect === 'ALLOW'
                    ).length
                    const resOpen = openResources.has(resource) || !!q

                    return (
                      <div key={resource} className='mt-2 rounded-md border'>
                        <button
                          type='button'
                          onClick={() => toggleResource(resource)}
                          className='hover:bg-muted/40 flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-sm'
                        >
                          <div className='flex items-center gap-2'>
                            {resOpen ? (
                              <ChevronDown className='h-3.5 w-3.5' />
                            ) : (
                              <ChevronRight className='h-3.5 w-3.5' />
                            )}
                            <span className='font-medium capitalize'>
                              {formatResourceLabel(resource)}
                            </span>
                          </div>
                          <span className='text-muted-foreground text-xs'>
                            {resGranted}/{permissions.length}
                          </span>
                        </button>
                        {resOpen && (
                          <div className='bg-muted/15 space-y-1 border-t px-2 py-2'>
                            {permissions.map((perm) => {
                              const row = assignedByKey.get(
                                `${perm.resource}:${perm.action}`
                              )
                              const granted = row?.effect === 'ALLOW'
                              return (
                                <div
                                  key={perm.id}
                                  className={cn(
                                    'flex items-start justify-between gap-2 rounded-md p-2',
                                    granted && 'bg-green-50 dark:bg-green-950/25'
                                  )}
                                >
                                  <div className='flex items-start gap-2'>
                                    <Checkbox
                                      checked={granted}
                                      onCheckedChange={() =>
                                        handleToggle(perm.resource, perm.action, granted)
                                      }
                                      disabled={readOnly}
                                      className='mt-0.5'
                                    />
                                    <div>
                                      <div className='text-sm font-medium capitalize'>
                                        {perm.action}
                                      </div>
                                      {perm.description && (
                                        <div className='text-muted-foreground text-xs'>
                                          {perm.description}
                                        </div>
                                      )}
                                      {row?.conditions && row.conditions.length > 0 && (
                                        <Badge variant='outline' className='mt-1 text-[10px]'>
                                          Conditional
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  {row?.effect && (
                                    <Badge
                                      variant={row.effect === 'ALLOW' ? 'default' : 'destructive'}
                                      className={cn(
                                        'shrink-0 text-[10px]',
                                        row.effect === 'ALLOW' && 'bg-green-600'
                                      )}
                                    >
                                      {row.effect}
                                    </Badge>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
