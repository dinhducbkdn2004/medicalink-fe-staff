import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useStaffs } from '@/features/staffs/data/use-staffs'
import { useAddUserToGroup } from '../../hooks'

type AddMembersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
}

export function AddMembersDialog({
  open,
  onOpenChange,
  groupId,
}: AddMembersDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const { data: staffsData, isLoading } = useStaffs({
    page: 1,
    limit: 50,
    search: searchTerm || undefined,
  })

  const addMutation = useAddUserToGroup()

  const users = staffsData?.data || []

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const handleAdd = async () => {
    if (selectedUserIds.length === 0) return

    try {
      for (const userId of selectedUserIds) {
        await addMutation.mutateAsync({
          userId,
          groupId,
        })
      }

      handleClose()
    } catch {
      void 0
    }
  }

  const handleClose = () => {
    setSelectedUserIds([])
    setSearchTerm('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex max-h-[85vh] max-w-2xl flex-col overflow-hidden'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>Add Members to Group</DialogTitle>
          <DialogDescription>
            Select users to add to this permission group.
          </DialogDescription>
        </DialogHeader>

        <div className='flex min-h-0 flex-1 flex-col space-y-4'>
          {}
          <div className='relative flex-shrink-0'>
            <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
            <Input
              type='search'
              placeholder='Search users...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {}
          <div className='min-h-0 flex-1 overflow-y-auto rounded-lg border'>
            {isLoading ? (
              <div className='text-muted-foreground flex items-center justify-center py-8'>
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className='text-muted-foreground flex items-center justify-center py-8'>
                No users found
              </div>
            ) : (
              <div className='divide-y'>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className='hover:bg-muted/50 flex cursor-pointer items-center gap-3 p-4'
                    onClick={() => handleToggleUser(user.id)}
                  >
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>{user.fullName}</span>
                        <Badge variant='outline' className='text-xs'>
                          {user.role}
                        </Badge>
                      </div>
                      <p className='text-muted-foreground text-sm'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          {selectedUserIds.length > 0 && (
            <div className='bg-muted/50 flex flex-shrink-0 items-center justify-between rounded-lg border p-3'>
              <span className='text-sm font-medium'>
                {selectedUserIds.length} user(s) selected
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedUserIds([])}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className='flex-shrink-0'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={addMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedUserIds.length === 0 || addMutation.isPending}
          >
            <UserPlus className='mr-2 h-4 w-4' />
            {addMutation.isPending
              ? 'Adding...'
              : `Add ${selectedUserIds.length} Member(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
