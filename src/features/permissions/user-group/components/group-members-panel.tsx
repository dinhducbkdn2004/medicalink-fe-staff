import { useState } from 'react'
import { UsersRound, UserPlus, X } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStaffs } from '@/features/staffs/data/use-staffs'
import { useRemoveUserFromGroup } from '../../hooks'
import { AddMembersDialog } from './add-members-dialog'

type GroupMembersPanelProps = {
  groupId?: string
}

export function GroupMembersPanel({ groupId }: GroupMembersPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removeMemberId, setRemoveMemberId] = useState<string>()

  const { data: staffsData, isLoading } = useStaffs({
    page: 1,
    limit: 100,
  })

  const removeMutation = useRemoveUserFromGroup()

  const members = staffsData?.data || []

  const handleRemove = async () => {
    if (!groupId || !removeMemberId) return

    try {
      await removeMutation.mutateAsync({
        userId: removeMemberId,
        groupId,
      })
      setRemoveMemberId(undefined)
    } catch {
      void 0
    }
  }

  if (!groupId) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-16'>
          <div className='text-muted-foreground text-center'>
            <UsersRound className='mx-auto mb-4 h-12 w-12' />
            <p>Select a group to view its members</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Group Members</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              Add Members
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground flex items-center justify-center py-8'>
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              <p>No members in this group</p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className='mr-2 h-4 w-4' />
                Add Members
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className='font-medium'>
                      {member.fullName}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{member.role}</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(member.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setRemoveMemberId(member.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {}
      <AddMembersDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        groupId={groupId}
      />

      {}
      <AlertDialog
        open={!!removeMemberId}
        onOpenChange={(open) => !open && setRemoveMemberId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user from the group? They
              will lose all permissions inherited from this group.
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
              {removeMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
