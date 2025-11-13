import { createFileRoute } from '@tanstack/react-router'
import MonthView from '@/features/appointments/pages/month-view'

export const Route = createFileRoute('/_authenticated/appointments/')({
  component: MonthView,
})
