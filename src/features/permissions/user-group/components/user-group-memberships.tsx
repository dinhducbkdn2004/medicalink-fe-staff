/**
 * User Group Memberships Component
 * Displays and manages groups that a user belongs to
 */
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
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useUserGroups, useRemoveUserFromGroup } from '../../hooks'
import { RoleGate } from '@/components/auth/role-gate'
import { AddToGroupDialog } from './add-to-group-dialog'

type UserGroupMembershipsProps = {
  userId?: string
}

export function UserGroupMemberships({ userId }: UserGroupMembershipsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removeGroupId, setRemoveGroupId] = useState<string>()

  const { data: memberships, isLoading } = useUserGroups(userId || '')
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
      // Error handling is done in mutation hook
    }
  }

  if (!userId) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardContent className='flex flex-col items-center justify-center gap-4 py-16'>
          <div className='rounded-full bg-primary/10 p-4'>
            <UsersRound className='h-10 w-10 text-primary' />
          </div>
          <div className='text-center'>
            <h3 className='font-semibold'>No User Selected</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Select a user from the list to view their group memberships
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className='border-muted/40 shadow-sm'>
        <CardHeader className='space-y-3 pb-4'>
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
      <Card className='border-muted/40 shadow-sm'>
        <CardHeader className='space-y-3 pb-4'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='rounded-lg bg-primary/10 p-2'>
                  <UsersRound className='h-4 w-4 text-primary' />
                </div>
                Group Memberships
              </CardTitle>
              <Badge
                variant='secondary'
                className='flex w-fit items-center gap-1 text-xs'
              >
                <CheckCircle2 className='h-3 w-3' />
                {memberships?.length || 0} group
                {memberships?.length === 1 ? '' : 's'}
              </Badge>
            </div>
            <RoleGate roles={['SUPER_ADMIN']}>
              <Button onClick={() => setShowAddDialog(true)} size='sm'>
                <UserPlus className='mr-2 h-4 w-4' />
                Add to Group
              </Button>
            </RoleGate>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          {!memberships || memberships.length === 0 ? (
            <div className='flex flex-col items-center justify-center gap-4 py-12'>
              <div className='rounded-full bg-muted p-3'>
                <AlertCircle className='h-6 w-6 text-muted-foreground' />
              </div>
              <div className='text-center'>
                <p className='font-medium'>No group memberships</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  This user is not a member of any group
                </p>
              </div>
              <RoleGate roles={['SUPER_ADMIN']}>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowAddDialog(true)}
                >
                  <UserPlus className='mr-2 h-4 w-4' />
                  Add to Group
                </Button>
              </RoleGate>
            </div>
          ) : (
            <ScrollArea className='h-[600px]'>
              <div className='space-y-2 p-4'>
                {memberships.map((membership) => (
                  <HoverCard key={membership.id} openDelay={300}>
                    <HoverCardTrigger asChild>
                      <Card className='border-muted/40 transition-all hover:shadow-md'>
                        <CardContent className='flex items-center justify-between p-4'>
                          <div className='flex-1 space-y-2'>
                            <div className='flex items-center gap-2'>
                              <div className='rounded-md bg-primary/10 p-1.5'>
                                <Shield className='h-3.5 w-3.5 text-primary' />
                              </div>
                              <h4 className='font-semibold'>
                                {membership.groupName}
                              </h4>
                              <Badge variant='secondary' className='text-xs'>
                                Member
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
                            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                              <Calendar className='h-3 w-3' />
                              Joined{' '}
                              {new Date(membership.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </div>
                          </div>
                          <RoleGate roles={['SUPER_ADMIN']}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                  onClick={() =>
                                    setRemoveGroupId(membership.groupId)
                                  }
                                  disabled={removeMutation.isPending}
                                >
                                  <X className='h-4 w-4 text-destructive' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove from group</p>
                              </TooltipContent>
                            </Tooltip>
                          </RoleGate>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent side='left' className='w-80'>
                      <div className='space-y-3'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <div className='rounded-md bg-primary/10 p-1.5'>
                              <Shield className='h-4 w-4 text-primary' />
                            </div>
                            <h4 className='font-semibold'>
                              {membership.groupName}
                            </h4>
                          </div>
                          <div className='mt-2 flex gap-2'>
                            <Badge variant='secondary' className='text-xs'>
                              Member
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
                              Description
                            </span>
                            <p className='mt-1 text-sm'>
                              {membership.groupDescription ||
                                'No description available'}
                            </p>
                          </div>
                          <div>
                            <span className='text-muted-foreground text-xs'>
                              Membership Date
                            </span>
                            <p className='mt-1 flex items-center gap-1.5 text-sm'>
                              <Calendar className='h-3.5 w-3.5' />
                              {new Date(membership.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
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

      {/* Add to Group Dialog */}
      <AddToGroupDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId={userId}
        existingGroupIds={memberships?.map((m) => m.groupId) || []}
      />

      {/* Remove from Group Confirmation */}
      <AlertDialog
        open={!!removeGroupId}
        onOpenChange={(open) => !open && setRemoveGroupId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-destructive/10 p-2'>
                <AlertCircle className='h-5 w-5 text-destructive' />
              </div>
              <div>
                <AlertDialogTitle>Remove from Group</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className='pt-2'>
              Are you sure you want to remove this user from this group? They will
              lose all permissions inherited from this group. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {removeMutation.isPending && (
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
              )}
              {removeMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
