import { useState } from 'react'
import {
  UsersRound,
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Shield,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RoleGate } from '@/components/auth/role-gate'
import { useUserGroups, useRemoveUserFromGroup, usePermissions } from '../../hooks'
import { AddToGroupDialog } from './add-to-group-dialog'
import { GroupInheritedPermissions } from './group-inherited-permissions'

type UserGroupMembershipsProps = {
  userId?: string
}

export function UserGroupMemberships({ userId }: UserGroupMembershipsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removeGroupId, setRemoveGroupId] = useState<string>()

  const { data: memberships, isLoading } = useUserGroups(userId || '')
  const { data: permissionCatalog } = usePermissions()
  const removeMutation = useRemoveUserFromGroup()

  const handleRemove = async () => {
    if (!userId || !removeGroupId) return

    try {
      await removeMutation.mutateAsync({
        userId,
        groupId: removeGroupId,
      })
      setRemoveGroupId(undefined)
    } catch {
      void 0
    }
  }

  if (!userId) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <div className='bg-primary/10 rounded-full p-4'>
            <UsersRound className='text-primary h-10 w-10' />
          </div>
          <div className='text-center'>
            <h3 className='font-semibold'>Chưa chọn người dùng</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Chọn một người dùng từ danh sách bên trên để xem các nhóm mà họ tham gia
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
            <Skeleton className='h-9 w-32' />
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className='h-20 w-full' />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className='border-muted/40 shadow-sm flex min-h-0 flex-1 flex-col'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='bg-primary/10 rounded-lg p-2'>
                  <UsersRound className='text-primary h-4 w-4' />
                </div>
                Các nhóm tham gia
              </CardTitle>
              <Badge
                variant='secondary'
                className='flex w-fit items-center gap-1 text-xs'
              >
                <CheckCircle2 className='h-3 w-3' />
                {memberships?.length || 0} nhóm
              </Badge>
            </div>
            <RoleGate roles={['SUPER_ADMIN']}>
              <Button onClick={() => setShowAddDialog(true)} size='sm'>
                <UserPlus className='mr-2 h-4 w-4' />
                Thêm vào nhóm
              </Button>
            </RoleGate>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col flex-1 p-0 min-h-0'>
          {!memberships || memberships.length === 0 ? (
            <div className='flex flex-col items-center justify-center gap-4 py-12 flex-1'>
              <div className='bg-muted rounded-full p-3'>
                <AlertCircle className='text-muted-foreground h-6 w-6' />
              </div>
              <div className='text-center'>
                <p className='font-medium'>Không tham gia nhóm nào</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Người dùng này không phải là thành viên của bất kỳ nhóm nào
                </p>
              </div>
              <RoleGate roles={['SUPER_ADMIN']}>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowAddDialog(true)}
                >
                  <UserPlus className='mr-2 h-4 w-4' />
                  Thêm vào nhóm
                </Button>
              </RoleGate>
            </div>
          ) : (
            <ScrollArea className='h-full flex-1 min-h-[200px]'>
              <div className='space-y-2 px-4 py-2'>
                {memberships.map((membership) => (
                  <HoverCard key={membership.id} openDelay={300}>
                    <HoverCardTrigger asChild>
                      <Card className='border-muted/40 transition-all hover:shadow-md'>
                        <CardContent className='flex flex-col gap-2 p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 space-y-2'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <div className='bg-primary/10 rounded-md p-1.5'>
                                  <Shield className='text-primary h-3.5 w-3.5' />
                                </div>
                                <h4 className='font-semibold'>
                                  {membership.groupName}
                                </h4>
                                <Badge variant='secondary' className='text-xs'>
                                  Thành viên
                                </Badge>
                                <Badge variant='outline' className='text-xs'>
                                  {membership.tenantId}
                                </Badge>
                              </div>
                              {membership.groupDescription && (
                                <p className='text-muted-foreground line-clamp-1 text-sm'>
                                  {membership.groupDescription}
                                </p>
                              )}
                              <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                                <Calendar className='h-3 w-3' />
                                Tham gia từ {' '}
                                {format(new Date(membership.createdAt), 'dd/MM/yyyy')}
                              </div>
                            </div>
                            <RoleGate roles={['SUPER_ADMIN']}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 shrink-0 p-0'
                                    onClick={() =>
                                      setRemoveGroupId(membership.groupId)
                                    }
                                    disabled={removeMutation.isPending}
                                  >
                                    <X className='text-destructive h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa khỏi nhóm</p>
                                </TooltipContent>
                              </Tooltip>
                            </RoleGate>
                          </div>
                          <GroupInheritedPermissions
                            groupId={membership.groupId}
                            tenantId={membership.tenantId}
                            catalog={permissionCatalog ?? []}
                          />
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent side='left' className='w-80'>
                      <div className='space-y-3'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <div className='bg-primary/10 rounded-md p-1.5'>
                              <Shield className='text-primary h-4 w-4' />
                            </div>
                            <h4 className='font-semibold'>
                              {membership.groupName}
                            </h4>
                          </div>
                          <div className='mt-2 flex gap-2'>
                            <Badge variant='secondary' className='text-xs'>
                              Thành viên
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              {membership.tenantId}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div className='space-y-2'>
                          <div>
                            <span className='text-muted-foreground text-xs'>
                              Mô tả
                            </span>
                            <p className='mt-1 text-sm'>
                              {membership.groupDescription ||
                                'Không có mô tả'}
                            </p>
                          </div>
                          <div>
                            <span className='text-muted-foreground text-xs'>
                              Ngày tham gia
                            </span>
                            <p className='mt-1 flex items-center gap-1.5 text-sm'>
                              <Calendar className='h-3.5 w-3.5' />
                              {format(new Date(membership.createdAt), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {}
      <AddToGroupDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId={userId}
        existingGroupIds={memberships?.map((m) => m.groupId) || []}
      />

      {}
      <AlertDialog
        open={!!removeGroupId}
        onOpenChange={(open) => !open && setRemoveGroupId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='flex items-center gap-3'>
              <div className='bg-destructive/10 rounded-full p-2'>
                <AlertCircle className='text-destructive h-5 w-5' />
              </div>
              <div>
                <AlertDialogTitle>Xóa khỏi nhóm</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className='pt-2'>
              Bạn có chắc chắn muốn xóa người dùng này khỏi nhóm? Họ sẽ mất tất cả các quyền được thừa kế từ nhóm này. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {removeMutation.isPending && (
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
              )}
              {removeMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
