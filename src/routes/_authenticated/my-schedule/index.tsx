import { createFileRoute } from '@tanstack/react-router'
import { MySchedule } from '@/features/my-schedule'

export const Route = createFileRoute('/_authenticated/my-schedule/')({
  component: MySchedule,
})
