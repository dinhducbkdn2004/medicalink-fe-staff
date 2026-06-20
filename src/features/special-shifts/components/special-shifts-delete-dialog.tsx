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
        setShrinkingError(error.response.data.message || 'Không thể xóa ca làm việc do có cuộc hẹn hiện tại.')
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
                Không thể thực hiện hành động
              </AlertDialogTitle>
              <AlertDialogDescription className='space-y-4 pt-2'>
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Phát hiện xung đột</AlertTitle>
                  <AlertDescription>{shrinkingError}</AlertDescription>
                </Alert>
                <p className='text-sm text-muted-foreground'>
                  Bạn phải hủy hoặc sắp xếp lại các cuộc hẹn xung đột trước khi có thể xóa ca làm việc này.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleClose}>Đã hiểu</AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn ca làm việc đặc biệt
                cho <span className='text-foreground font-medium'>Dr. {currentRow?.doctor?.firstName} {currentRow?.doctor?.lastName}</span> vào{' '}
                <span className='text-foreground font-medium'>
                  {currentRow?.effectiveDate ? format(new Date(currentRow.effectiveDate), 'MMM dd, yyyy') : ''}
                </span>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className={buttonVariants({ variant: 'destructive' })}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
