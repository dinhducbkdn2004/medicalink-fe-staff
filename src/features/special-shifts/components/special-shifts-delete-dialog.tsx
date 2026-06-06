import { format } from 'date-fns'
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
import { buttonVariants } from '@/components/ui/button'
import { useDeleteSpecialShift } from '../data/use-special-shifts'
import { useSpecialShiftsContext } from './special-shifts-provider'

export function SpecialShiftsDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useSpecialShiftsContext()
  const deleteMutation = useDeleteSpecialShift()

  const isOpen = open === 'delete'

  const handleClose = () => {
    if (deleteMutation.isPending) return
    setOpen(null)
    setCurrentRow(null)
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!currentRow) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      handleClose()
    } catch (error) {
      console.error('Failed to delete special shift:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the special shift
            for <span className='text-foreground font-medium'>Dr. {currentRow?.doctor?.firstName} {currentRow?.doctor?.lastName}</span> on{' '}
            <span className='text-foreground font-medium'>
              {currentRow?.date ? format(new Date(currentRow.date), 'MMM dd, yyyy') : ''}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={buttonVariants({ variant: 'destructive' })}
            disabled={deleteMutation.isPending}
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
