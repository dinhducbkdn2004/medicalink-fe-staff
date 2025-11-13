/**
 * Delete Patient Dialog
 * Confirmation modal for soft-deleting a patient
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
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft delete the patient record for{' '}
            <span className='font-semibold'>{currentRow?.fullName}</span>. The
            record can be restored later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
