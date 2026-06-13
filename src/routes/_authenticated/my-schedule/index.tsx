import { createFileRoute } from '@tanstack/react-router'
import { MySchedule } from '@/features/my-schedule'
import type { SearchParams } from '@/types/common.types'
import { startOfWeek, endOfWeek, format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/my-schedule/')({
  component: MySchedule,
  validateSearch: (search: Record<string, unknown>): SearchParams & { startDate?: string; endDate?: string } => {
    return {
      page: Number(search?.page ?? 1),
      limit: Number(search?.limit ?? 50),
      sortBy: (search?.sortBy as string) ?? undefined,
      sortOrder: (search?.sortOrder as 'asc' | 'desc') ?? undefined,
      startDate: (search?.startDate as string) ?? undefined,
      endDate: (search?.endDate as string) ?? undefined,
    }
  },
})
