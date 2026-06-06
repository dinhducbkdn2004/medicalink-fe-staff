import { createFileRoute } from '@tanstack/react-router'
import { Holidays } from '@/features/holidays'
import { SearchParams } from '@/types/common.types'

export const Route = createFileRoute('/_authenticated/holidays/')({
  component: Holidays,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      page: Number(search?.page ?? 1),
      limit: Number(search?.limit ?? 10),
      sortBy: (search?.sortBy as string) ?? 'createdAt',
      sortOrder: (search?.sortOrder as 'asc' | 'desc') ?? 'desc',
      workLocationId: (search?.workLocationId as string) ?? undefined,
    }
  },
})
