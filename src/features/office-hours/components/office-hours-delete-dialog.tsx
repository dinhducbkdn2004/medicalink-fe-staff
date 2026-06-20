/* eslint-disable @typescript-eslint/no-explicit-any */

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
    } catch (err) {
      const error = err as any;
      const code = error?.response?.data?.details?.code
      if (code === 'SHRINKING_WINDOW') {
        setShrinkingError(error.response.data.message || 'Không thể xóa giờ làm việc do đã có lịch hẹn.')
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
                Hành động bị chặn
              </AlertDialogTitle>
              <AlertDialogDescription className='space-y-4 pt-2'>
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Phát hiện xung đột</AlertTitle>
                  <AlertDescription>{shrinkingError}</AlertDescription>
                </Alert>
                <p className='text-sm text-muted-foreground'>
                  Bạn phải hủy hoặc dời lại các lịch hẹn bị xung đột trước khi có thể xóa giờ làm việc này.
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
              <AlertDialogTitle>Xóa Giờ làm việc</AlertDialogTitle>
              <AlertDialogDescription className='space-y-2'>
                <p>Bạn có chắc chắn muốn xóa ca làm việc này không?</p>
                <div className='rounded-md border p-3 text-sm'>
                  <p>
                    <strong>Ngày:</strong> {dayLabel}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {startTime} - {endTime}
                  </p>
                  {currentRow.doctor && (
                    <p>
                      <strong>Bác sĩ:</strong> {currentRow.doctor.firstName}{' '}
                      {currentRow.doctor.lastName}
                    </p>
                  )}
                  {currentRow.workLocation && (
                    <p>
                      <strong>Địa điểm:</strong> {currentRow.workLocation.name}
                    </p>
                  )}
                </div>
                <p className='text-destructive font-medium'>
                  Hành động này không thể hoàn tác.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
