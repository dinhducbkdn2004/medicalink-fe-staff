import { createFileRoute } from '@tanstack/react-router'
import { DoctorProfileView } from '@/features/doctors/pages/doctor-profile-view'

export const Route = createFileRoute('/_authenticated/doctors/$doctorId/profile')({
  component: DoctorProfileView,
})
