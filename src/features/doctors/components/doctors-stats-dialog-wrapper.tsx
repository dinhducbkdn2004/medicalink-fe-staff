
import { DoctorStatsDialog } from './doctor-stats-dialog'
import { useDoctors } from './doctors-provider'

export function DoctorsStatsDialogWrapper() {
  const { open, setOpen, currentRow } = useDoctors()

  return (
    <DoctorStatsDialog
      doctor={currentRow}
      open={open === 'stats'}
      onOpenChange={(isOpen) => setOpen(isOpen ? 'stats' : null)}
    />
  )
}
