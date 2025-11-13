import { createFileRoute } from '@tanstack/react-router'
import YearView from '@/features/appointments/pages/year-view'

export const Route = createFileRoute('/_authenticated/appointments/year-view')({
  component: YearView,
})
