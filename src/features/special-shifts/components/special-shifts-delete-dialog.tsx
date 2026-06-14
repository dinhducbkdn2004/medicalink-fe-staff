/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Loader2, AlertCircle } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { useDeleteSpecialShift } from '../data/use-special-shifts'
import { useSpecialShiftsContext } from './special-shifts-provider'

export function SpecialShiftsDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useSpecialShiftsContext()
  const deleteMutation = useDeleteSpecialShift()
  const [shrinkingError, setShrinkingError] = useState<string | null>(null)

  const isOpen = open === 'delete'

  useEffect(() => {
    if (!isOpen) {
      setShrinkingError(null)
    }
  }, [isOpen])

  const handleClose = () => {
    if (deleteMutation.isPending) return
    setOpen(null)
    setCurrentRow(null)
    setShrinkingError(null)
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!currentRow) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      handleClose()
    } catch (err) {
      const error = err as any;
      const code = error?.response?.data?.details?.code
      if (code === 'SHRINKING_WINDOW') {
        setShrinkingError(error.response.data.message || 'Cannot delete special shift due to existing appointments.')
      } else {
        console.error('Failed to delete special shift:', error)
      }
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        {shrinkingError ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center text-destructive'>
                <AlertCircle className='mr-2 h-5 w-5' />
                Action Prevented
              </AlertDialogTitle>
              <AlertDialogDescription className='space-y-4 pt-2'>
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Conflict Detected</AlertTitle>
                  <AlertDescription>{shrinkingError}</AlertDescription>
                </Alert>
                <p className='text-sm text-muted-foreground'>
                  You must cancel or reschedule the conflicting appointments before you can delete this shift.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleClose}>Acknowledge</AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the special shift
                for <span className='text-foreground font-medium'>Dr. {currentRow?.doctor?.firstName} {currentRow?.doctor?.lastName}</span> on{' '}
                <span className='text-foreground font-medium'>
                  {currentRow?.effectiveDate ? format(new Date(currentRow.effectiveDate), 'MMM dd, yyyy') : ''}
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
