import { createFileRoute } from '@tanstack/react-router'
import { AppointmentsLayout } from '@/features/appointments/components/appointments-layout'

export const Route = createFileRoute('/_authenticated/appointments')({
  component: AppointmentsLayout,
})
