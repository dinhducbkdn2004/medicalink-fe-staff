
import { useState, useEffect } from 'react'
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
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getDayLabel } from '../data/schema'
import { useDeleteOfficeHour } from '../data/use-office-hours'
import { useOfficeHoursContext } from './office-hours-provider'

function formatTime(timeString: string): string {
  try {
    if (timeString.includes('T')) {
      const date = new Date(timeString)
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return timeString
  } catch {
    return timeString
  }
}

export function OfficeHoursDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useOfficeHoursContext()
  const deleteMutation = useDeleteOfficeHour()
  const [shrinkingError, setShrinkingError] = useState<string | null>(null)

  const isOpen = open === 'delete'

  useEffect(() => {
    if (!isOpen) {
      setShrinkingError(null)
    }
  }, [isOpen])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    setShrinkingError(null)
  }

  const handleDelete = async () => {
    if (!currentRow) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      handleClose()
    } catch (error: any) {
      const code = error?.response?.data?.details?.code
      if (code === 'SHRINKING_WINDOW') {
        setShrinkingError(error.response.data.message || 'Cannot delete office hours due to existing appointments.')
      }
    }
  }

  if (!currentRow) return null

  const dayLabel = getDayLabel(currentRow.dayOfWeek)
  const startTime = formatTime(currentRow.startTime)
  const endTime = formatTime(currentRow.endTime)

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
                  You must cancel or reschedule the conflicting appointments before you can delete these office hours.
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
              <AlertDialogTitle>Delete Office Hours</AlertDialogTitle>
              <AlertDialogDescription className='space-y-2'>
                <p>Are you sure you want to delete this office hour entry?</p>
                <div className='rounded-md border p-3 text-sm'>
                  <p>
                    <strong>Day:</strong> {dayLabel}
                  </p>
                  <p>
                    <strong>Time:</strong> {startTime} - {endTime}
                  </p>
                  {currentRow.doctor && (
                    <p>
                      <strong>Doctor:</strong> {currentRow.doctor.firstName}{' '}
                      {currentRow.doctor.lastName}
                    </p>
                  )}
                  {currentRow.workLocation && (
                    <p>
                      <strong>Location:</strong> {currentRow.workLocation.name}
                    </p>
                  )}
                </div>
                <p className='text-destructive font-medium'>
                  This action cannot be undone.
                </p>
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
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
