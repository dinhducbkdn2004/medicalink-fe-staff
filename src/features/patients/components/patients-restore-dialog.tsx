/**
 * Restore Patient Dialog
 * Confirmation modal for restoring a soft-deleted patient
 */
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
          <AlertDialogTitle>Restore Patient?</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore the patient record for{' '}
            <span className='font-semibold'>{currentRow?.fullName}</span> and
            make it active again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore} disabled={isPending}>
            {isPending ? 'Restoring...' : 'Restore'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
