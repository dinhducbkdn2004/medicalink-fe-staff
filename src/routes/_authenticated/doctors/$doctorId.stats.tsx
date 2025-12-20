import { createFileRoute } from '@tanstack/react-router'
import { DoctorStatsPage } from '@/features/doctors/pages/doctor-stats-page'

export const Route = createFileRoute('/_authenticated/doctors/$doctorId/stats')(
  {
    component: DoctorStatsRoute,
  }
)

function DoctorStatsRoute() {
  return <DoctorStatsPage />
}
