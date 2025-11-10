/**
 * Work Locations Delete Dialog
 * Confirmation dialog for deleting work locations
 */
import { Loader2 } from 'lucide-react'
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
import { type WorkLocation } from '../data/schema'
import { useDeleteWorkLocation } from '../data/use-work-locations'

interface WorkLocationsDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: WorkLocation
}

export function WorkLocationsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: WorkLocationsDeleteDialogProps) {
  const deleteMutation = useDeleteWorkLocation()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      onOpenChange()
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Delete error:', error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className='space-y-2'>
            <p>
              This will permanently delete the work location{' '}
              <span className='font-semibold text-foreground'>
                "{currentRow.name}"
              </span>
              .
            </p>
            {currentRow.doctorsCount && currentRow.doctorsCount > 0 && (
              <p className='text-warning font-medium'>
                ⚠️ Warning: This location is assigned to {currentRow.doctorsCount}{' '}
                doctor(s). Deletion may fail if there are active associations.
              </p>
            )}
            <p>This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending && (
              <Loader2 className='mr-2 size-4 animate-spin' />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

