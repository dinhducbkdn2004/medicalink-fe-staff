import { createFileRoute } from '@tanstack/react-router'
import WeekView from '@/features/appointments/pages/week-view'

export const Route = createFileRoute('/_authenticated/appointments/week-view')({
  component: WeekView,
})
