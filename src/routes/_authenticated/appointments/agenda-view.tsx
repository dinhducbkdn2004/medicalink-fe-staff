import { createFileRoute } from '@tanstack/react-router'
import AgendaView from '@/features/appointments/pages/agenda-view'

export const Route = createFileRoute(
  '/_authenticated/appointments/agenda-view'
)({
  component: AgendaView,
})
