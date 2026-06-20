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
import { useDeleteClinicException } from '../data/use-clinic-exceptions'
import { useHolidaysContext } from './holidays-provider'

export function ClinicExceptionsDeleteDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useHolidaysContext()
  const deleteMutation = useDeleteClinicException()

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
      console.error('Failed to delete holiday:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Nó sẽ xóa vĩnh viễn ngày nghỉ
            được cấu hình cho{' '}
            <span className='text-foreground font-medium'>
              {currentRow?.date ? format(new Date(currentRow.date), 'MMM dd, yyyy') : ''}
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
      </AlertDialogContent>
    </AlertDialog>
  )
}
