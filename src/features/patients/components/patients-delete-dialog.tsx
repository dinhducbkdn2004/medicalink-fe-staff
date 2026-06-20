
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
import { useDeletePatient } from '../data/use-patients'
import { usePatients } from './patients-provider'

export function PatientsDeleteDialog() {
  const { open, setOpen, currentRow } = usePatients()
  const { mutate: deletePatient, isPending } = useDeletePatient()

  const handleDelete = () => {
    if (!currentRow) return

    deletePatient(currentRow.id, {
      onSuccess: () => {
        setOpen(null)
      },
    })
  }

  return (
    <AlertDialog
      open={open === 'delete'}
      onOpenChange={(isOpen) => !isOpen && setOpen(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này sẽ xóa mềm hồ sơ bệnh nhân{' '}
            <span className='font-semibold'>{currentRow?.fullName}</span>. Hồ sơ này có thể được khôi phục lại sau này nếu cần.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
