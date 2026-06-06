import { SpecialShiftsActionDialog } from './special-shifts-action-dialog'
import { SpecialShiftsDeleteDialog } from './special-shifts-delete-dialog'

export function SpecialShiftsDialogs({ defaultDoctorId }: { defaultDoctorId?: string }) {
  return (
    <>
      <SpecialShiftsActionDialog defaultDoctorId={defaultDoctorId} />
      <SpecialShiftsDeleteDialog />
    </>
  )
}
