import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Staff } from '../data/schema'
import { useDeleteStaff } from '../data/use-staffs'

type StaffDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Staff
}

export function StaffsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StaffDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteStaff()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.email) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      onOpenChange(false)
      setValue('')
    } catch (error) {
      
      console.error('Failed to delete staff member:', error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.email || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete Staff Member
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.fullName}</span>?
            <br />
            This action will permanently remove the staff member with the role
            of <span className='font-bold'>{currentRow.role}</span> from the
            system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Email Address:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter email address to confirm deletion.'
              disabled={deleteMutation.isPending}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
