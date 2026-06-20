
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
import { useRestorePatient } from '../data/use-patients'
import { usePatients } from './patients-provider'

export function PatientsRestoreDialog() {
  const { open, setOpen, currentRow } = usePatients()
  const { mutate: restorePatient, isPending } = useRestorePatient()

  const handleRestore = () => {
    if (!currentRow) return

    restorePatient(currentRow.id, {
      onSuccess: () => {
        setOpen(null)
      },
    })
  }

  return (
    <AlertDialog
      open={open === 'restore'}
      onOpenChange={(isOpen) => !isOpen && setOpen(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Khôi phục bệnh nhân?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này sẽ khôi phục hồ sơ bệnh nhân{' '}
            <span className='font-semibold'>{currentRow?.fullName}</span> và
            làm cho hồ sơ này hoạt động trở lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore} disabled={isPending}>
            {isPending ? 'Đang khôi phục...' : 'Khôi phục'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
