import { createFileRoute } from '@tanstack/react-router'
import DayView from '@/features/appointments/pages/day-view'

export const Route = createFileRoute('/_authenticated/appointments/day-view')({
  component: DayView,
})
