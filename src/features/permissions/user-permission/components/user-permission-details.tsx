/**
 * User Permission Details Component
 * Displays permission details for selected user
 */
import { useMemo, useState } from 'react'
import {
  Shield,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  useUserPermissions,
  useRevokeUserPermission,
  useRefreshUserPermissionCache,
} from '../../hooks'
import { RoleGate } from '@/components/auth/role-gate'
import { cn } from '@/lib/utils'

type UserPermissionDetailsProps = {
  userId?: string
}

export function UserPermissionDetails({ userId }: UserPermissionDetailsProps) {
  const { data: permissions, isLoading } = useUserPermissions(userId || '')
  const revokeMutation = useRevokeUserPermission()
  const refreshCacheMutation = useRefreshUserPermissionCache()
  const [filterResource, setFilterResource] = useState<string>('all')
  const [filterEffect, setFilterEffect] = useState<string>('all')

  // Get unique resources for filter
  const resources = useMemo(() => {
    if (!permissions) return []
    return Array.from(new Set(permissions.map((p) => p.resource)))
  }, [permissions])

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    if (!permissions) return []
    return permissions.filter((perm) => {
      const matchResource =
        filterResource === 'all' || perm.resource === filterResource
      const matchEffect =
        filterEffect === 'all' || perm.effect === filterEffect
      return matchResource && matchEffect
    })
  }, [permissions, filterResource, filterEffect])

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof filteredPermissions> = {}
    filteredPermissions.forEach((perm) => {
      if (!groups[perm.resource]) {
        groups[perm.resource] = []
      }
      groups[perm.resource].push(perm)
    })
    return groups
  }, [filteredPermissions])

  const handleRevoke = async (resource: string, action: string) => {
    if (!userId) return

    const permissionId = `perm_${resource}_${action}`
    await revokeMutation.mutateAsync({
      userId,
      permissionId,
      tenantId: 'global',
    })
  }

  const handleRefreshCache = async () => {
    if (!userId) return
    await refreshCacheMutation.mutateAsync({
      userId,
      tenantId: 'global',
    })
  }

  if (!userId) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <div className='rounded-full bg-primary/10 p-4'>
            <Shield className='h-10 w-10 text-primary' />
          </div>
          <div className='text-center'>
            <h3 className='font-semibold'>No User Selected</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Select a user from the list to view their permissions
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
            <RefreshCw className='h-4 w-4 animate-spin text-primary' />
            <p className='text-muted-foreground text-sm'>
              Loading permissions...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-muted/40 shadow-sm'>
      <CardHeader className='space-y-4 pb-4'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <div className='rounded-lg bg-primary/10 p-2'>
                <Shield className='h-4 w-4 text-primary' />
              </div>
              User Permissions
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Badge
                variant='secondary'
                className='flex items-center gap-1 text-xs'
              >
                <CheckCircle2 className='h-3 w-3' />
                {permissions?.length || 0} total
              </Badge>
              {filteredPermissions.length !== permissions?.length && (
                <Badge variant='outline' className='text-xs'>
                  {filteredPermissions.length} filtered
                </Badge>
              )}
            </div>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleRefreshCache}
                  disabled={refreshCacheMutation.isPending}
                  className='gap-2'
                >
                  <RefreshCw
                    className={cn(
                      'h-4 w-4',
                      refreshCacheMutation.isPending && 'animate-spin'
                    )}
                  />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh permission cache</p>
              </TooltipContent>
            </Tooltip>
          </RoleGate>
        </div>

        {/* Filters */}
        {permissions && permissions.length > 0 && (
          <>
            <Separator />
            <div className='flex flex-wrap items-center gap-2'>
              <div className='flex items-center gap-2 text-sm'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>Filters:</span>
              </div>
              <Select value={filterResource} onValueChange={setFilterResource}>
                <SelectTrigger className='h-8 w-[160px]'>
                  <SelectValue placeholder='All resources' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All resources</SelectItem>
                  {resources.map((resource) => (
                    <SelectItem key={resource} value={resource}>
                      {resource.replace(/-/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterEffect} onValueChange={setFilterEffect}>
                <SelectTrigger className='h-8 w-[120px]'>
                  <SelectValue placeholder='All effects' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All effects</SelectItem>
                  <SelectItem value='ALLOW'>ALLOW</SelectItem>
                  <SelectItem value='DENY'>DENY</SelectItem>
                </SelectContent>
              </Select>
              {(filterResource !== 'all' || filterEffect !== 'all') && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8'
                  onClick={() => {
                    setFilterResource('all')
                    setFilterEffect('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className='p-0'>
        {!permissions || permissions.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4 py-12'>
            <div className='rounded-full bg-muted p-3'>
              <AlertCircle className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='text-center'>
              <p className='font-medium'>No permissions assigned</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                This user has no direct permissions
              </p>
            </div>
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4 py-12'>
            <div className='rounded-full bg-muted p-3'>
              <Eye className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='text-center'>
              <p className='font-medium'>No matching permissions</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className='h-[600px]'>
            <div className='space-y-2 p-4'>
              {Object.entries(groupedPermissions).map(
                ([resource, perms]) => (
                  <Collapsible key={resource} defaultOpen>
                    <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg border bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='capitalize'>
                          {resource.replace(/-/g, ' ')}
                        </Badge>
                        <span className='text-muted-foreground text-xs'>
                          {perms.length} permission
                          {perms.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='mt-2'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='w-[200px]'>
                              Action
                            </TableHead>
                            <TableHead className='w-[100px]'>
                              Effect
                            </TableHead>
                            <TableHead>Conditions</TableHead>
                            <TableHead className='w-[80px]'>
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {perms.map((perm, index) => (
                            <TableRow
                              key={`${perm.resource}-${perm.action}-${index}`}
                            >
                              <TableCell className='font-medium capitalize'>
                                {perm.action}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    perm.effect === 'ALLOW'
                                      ? 'default'
                                      : 'destructive'
                                  }
                                  className={cn(
                                    'text-xs',
                                    perm.effect === 'ALLOW' && 'bg-green-600'
                                  )}
                                >
                                  {perm.effect}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {perm.conditions &&
                                perm.conditions.length > 0 ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant='outline'
                                        className='cursor-help text-xs'
                                      >
                                        {perm.conditions.length} condition
                                        {perm.conditions.length > 1 ? 's' : ''}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-xs'>
                                      <div className='space-y-1'>
                                        {perm.conditions.map((cond, i) => (
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
                                ) : (
                                  <span className='text-muted-foreground text-xs'>
                                    None
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <RoleGate roles={['SUPER_ADMIN']}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 w-8 p-0'
                                        onClick={() =>
                                          handleRevoke(
                                            perm.resource,
                                            perm.action
                                          )
                                        }
                                        disabled={revokeMutation.isPending}
                                      >
                                        <XCircle className='h-4 w-4 text-destructive' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Revoke permission</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </RoleGate>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                )
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
