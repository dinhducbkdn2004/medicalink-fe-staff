import { useMemo, useState } from 'react'
import {
  Shield,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  Permission,
  UserPermissionItem,
} from '@/api/types/permission.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RoleGate } from '@/components/auth/role-gate'
import {
  useUserPermissions,
  useRevokeUserPermission,
  usePermissions,
} from '../../hooks'
import {
  groupCatalogByModule,
  formatResourceLabel,
} from '../../utils/permission-catalog'

type UserPermissionDetailsProps = {
  userId?: string
}

export function UserPermissionDetails({ userId }: UserPermissionDetailsProps) {
  const { data: allPermissions } = usePermissions()
  const { data: permissions, isLoading } = useUserPermissions(userId || '')
  const revokeMutation = useRevokeUserPermission()

  const [filterResource, setFilterResource] = useState<string>('all')
  const [filterEffect, setFilterEffect] = useState<string>('all')
  const [searchQ, setSearchQ] = useState('')

  const resources = useMemo(() => {
    if (!permissions) return []
    return Array.from(new Set(permissions.map((p) => p.resource)))
  }, [permissions])

  const filteredPermissions = useMemo(() => {
    if (!permissions) return []
    const q = searchQ.trim().toLowerCase()
    return permissions.filter((perm) => {
      const matchResource =
        filterResource === 'all' || perm.resource === filterResource
      const matchEffect = filterEffect === 'all' || perm.effect === filterEffect
      const matchSearch =
        !q ||
        `${perm.resource} ${perm.action}`.toLowerCase().includes(q)
      return matchResource && matchEffect && matchSearch
    })
  }, [permissions, filterResource, filterEffect, searchQ])

  const catalogForTree = useMemo((): Permission[] => {
    if (!allPermissions || !filteredPermissions.length) return []
    return filteredPermissions.map((up, i) => {
      const def = allPermissions.find(
        (p) => p.resource === up.resource && p.action === up.action
      )
      return {
        id: def?.id ?? `usr-${i}`,
        resource: up.resource,
        action: up.action,
        description: def?.description,
      }
    })
  }, [allPermissions, filteredPermissions])

  const moduleTree = useMemo(
    () => groupCatalogByModule(catalogForTree),
    [catalogForTree]
  )

  const userPermByKey = useMemo(() => {
    const m = new Map<string, UserPermissionItem>()
    for (const p of filteredPermissions) {
      m.set(`${p.resource}:${p.action}`, p)
    }
    return m
  }, [filteredPermissions])

  const handleRevoke = async (resource: string, action: string) => {
    if (!userId || !allPermissions) return

    const permission = allPermissions.find(
      (p) => p.resource === resource && p.action === action
    )

    if (!permission) {
      console.warn(`Permission not found for ${resource}:${action}`)
      return
    }

    await revokeMutation.mutateAsync({
      userId,
      permissionId: permission.id,
    })
  }

  if (!userId) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <div className='bg-primary/10 rounded-full p-4'>
            <Shield className='text-primary h-10 w-10' />
          </div>
          <div className='text-center'>
            <h3 className='font-semibold'>Chưa chọn người dùng</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Chọn một người dùng từ danh sách bên trên để xem các quyền trực tiếp của họ
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardContent className='flex items-center justify-center py-16'>
          <div className='flex items-center gap-2'>
            <RefreshCw className='text-primary h-4 w-4 animate-spin' />
            <p className='text-muted-foreground text-sm'>
              Đang tải các quyền...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-muted/40 shadow-sm flex min-h-0 flex-1 flex-col'>
      <CardHeader className='space-y-4 pb-4'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <div className='bg-primary/10 rounded-lg p-2'>
                <Shield className='text-primary h-4 w-4' />
              </div>
              Quyền trực tiếp (người dùng)
            </CardTitle>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge
                variant='secondary'
                className='flex items-center gap-1 text-xs'
              >
                <CheckCircle2 className='h-3 w-3' />
                {permissions?.length || 0} quyền
              </Badge>
              {filteredPermissions.length !== permissions?.length && (
                <Badge variant='outline' className='text-xs'>
                  Đang hiển thị {filteredPermissions.length} / {permissions?.length}
                </Badge>
              )}
            </div>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            <Tooltip>
              <TooltipTrigger asChild></TooltipTrigger>
              <TooltipContent>
                <p>Làm mới bộ nhớ đệm quyền</p>
              </TooltipContent>
            </Tooltip>
          </RoleGate>
        </div>

        {permissions && permissions.length > 0 && (
          <>
            <Separator />
            <div className='flex flex-col gap-3'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                <Input
                  placeholder='Tìm kiếm theo tài nguyên hoặc hành động...'
                  className='h-9 pl-8'
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Filter className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Bộ lọc:</span>
                </div>
                <Select value={filterResource} onValueChange={setFilterResource}>
                  <SelectTrigger className='h-8 w-[180px]'>
                    <SelectValue placeholder='Tài nguyên' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả tài nguyên</SelectItem>
                    {resources.map((resource) => (
                      <SelectItem key={resource} value={resource}>
                        {formatResourceLabel(resource)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterEffect} onValueChange={setFilterEffect}>
                  <SelectTrigger className='h-8 w-[120px]'>
                    <SelectValue placeholder='Hiệu lực' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả hiệu lực</SelectItem>
                    <SelectItem value='ALLOW'>ALLOW</SelectItem>
                    <SelectItem value='DENY'>DENY</SelectItem>
                  </SelectContent>
                </Select>
                {(filterResource !== 'all' ||
                  filterEffect !== 'all' ||
                  searchQ.trim()) && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8'
                    onClick={() => {
                      setFilterResource('all')
                      setFilterEffect('all')
                      setSearchQ('')
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className='flex flex-col flex-1 p-0 min-h-0'>
        {!permissions || permissions.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4 py-12 flex-1'>
            <div className='bg-muted rounded-full p-3'>
              <AlertCircle className='text-muted-foreground h-6 w-6' />
            </div>
            <div className='text-center'>
              <p className='font-medium'>Không có quyền trực tiếp</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Người dùng này có thể vẫn có quyền truy cập thông qua các nhóm
              </p>
            </div>
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4 py-12 flex-1'>
            <div className='bg-muted rounded-full p-3'>
              <Eye className='text-muted-foreground h-6 w-6' />
            </div>
            <div className='text-center'>
              <p className='font-medium'>Không có kết quả</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Thử điều chỉnh bộ lọc hoặc tìm kiếm
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className='h-full flex-1 min-h-[200px]'>
            <div className='space-y-2 p-4'>
              {moduleTree.map((mod) => (
                <Collapsible key={mod.moduleId} defaultOpen>
                  <CollapsibleTrigger className='bg-muted/30 hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors'>
                    <div className='flex items-center gap-2'>
                      <ChevronDown className='h-4 w-4 shrink-0' />
                      <span className='text-sm font-medium'>{mod.meta.title}</span>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {
                        mod.resources.reduce(
                          (n, r) => n + r.permissions.length,
                          0
                        )
                      }{' '}
                      quyền
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='mt-2 space-y-2 pl-2'>
                    {mod.resources.map(({ resource, permissions: perms }) => (
                      <Collapsible key={resource} defaultOpen>
                        <CollapsibleTrigger className='bg-background flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left text-sm'>
                          <ChevronRight className='h-3.5 w-3.5' />
                          <span className='font-medium capitalize'>
                            {formatResourceLabel(resource)}
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            ({perms.length})
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className='mt-1 space-y-1 border-l-2 border-muted pl-3'>
                          {perms.map((p) => {
                            const snap = userPermByKey.get(
                              `${p.resource}:${p.action}`
                            )
                            const allowed = snap?.effect === 'ALLOW'
                            return (
                              <div
                                key={`${p.resource}-${p.action}`}
                                className={cn(
                                  'flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border px-3 py-2.5 transition-colors',
                                  allowed
                                    ? 'border-green-200/60 bg-green-50/50 hover:bg-green-50/80 dark:border-green-900/50 dark:bg-green-950/10 dark:hover:bg-green-950/20'
                                    : 'border-destructive/20 bg-destructive/5 hover:bg-destructive/10'
                                )}
                              >
                                <div className='flex items-start sm:items-center gap-3 flex-1 min-w-0'>
                                  <span
                                    className={cn(
                                      'mt-1 sm:mt-0 inline-block h-2 w-2 shrink-0 rounded-full',
                                      allowed ? 'bg-green-500' : 'bg-destructive'
                                    )}
                                  />
                                  <div className='flex-1 min-w-0 flex flex-col justify-center'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                      <span className='text-sm font-medium capitalize truncate'>
                                        {p.action}
                                      </span>
                                      {snap?.conditions && snap.conditions.length > 0 && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge
                                              variant='outline'
                                              className='cursor-help text-[10px] h-5 px-1.5 bg-background/50'
                                            >
                                              {snap.conditions.length} điều kiện
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent className='max-w-xs'>
                                            <div className='space-y-1'>
                                              {snap.conditions.map((cond, i) => (
                                                <div
                                                  key={i}
                                                  className='font-mono text-xs'
                                                >
                                                  {cond.field} {cond.operator}{' '}
                                                  {JSON.stringify(cond.value)}
                                                </div>
                                              ))}
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                    {p.description && (
                                      <p className='text-muted-foreground text-xs line-clamp-1 mt-0.5'>
                                        {p.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className='flex shrink-0 items-center gap-2 sm:ml-4'>
                                  <Badge
                                    variant={allowed ? 'default' : 'destructive'}
                                    className={cn(
                                      'text-[10px] h-5',
                                      allowed && 'bg-green-600 hover:bg-green-700 text-white'
                                    )}
                                  >
                                    {snap?.effect}
                                  </Badge>
                                  <RoleGate roles={['SUPER_ADMIN']}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7 text-muted-foreground hover:text-destructive'
                                          onClick={() =>
                                            handleRevoke(p.resource, p.action)
                                          }
                                          disabled={revokeMutation.isPending}
                                        >
                                          <XCircle className='h-4 w-4' />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Thu hồi quyền</TooltipContent>
                                    </Tooltip>
                                  </RoleGate>
                                </div>
                              </div>
                            )
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
