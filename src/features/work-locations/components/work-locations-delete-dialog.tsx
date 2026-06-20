
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
      
      console.error('Delete error:', error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription className='space-y-2'>
            <p>
              Thao tác này sẽ xóa vĩnh viễn địa điểm làm việc{' '}
              <span className='font-semibold text-foreground'>
                "{currentRow.name}"
              </span>
              .
            </p>
            {currentRow.doctorsCount && currentRow.doctorsCount > 0 && (
              <p className='text-warning font-medium'>
                ⚠️ Cảnh báo: Địa điểm này đã được gán cho {currentRow.doctorsCount}{' '}
                bác sĩ. Việc xóa có thể thất bại nếu có các liên kết đang hoạt động.
              </p>
            )}
            <p>Hành động này không thể hoàn tác.</p>
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
            {deleteMutation.isPending && (
              <Loader2 className='mr-2 size-4 animate-spin' />
            )}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

