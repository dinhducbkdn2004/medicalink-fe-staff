import { useMemo } from 'react'
import { DataTable } from '@/components/data-table'
import { myScheduleColumns, type ScheduleItem } from './my-schedule-columns'
import type { OfficeHour } from '@/features/office-hours/data/schema'
import type { SpecialShift } from '@/features/special-shifts/data/schema'

interface MyScheduleTableProps {
  type: 'all' | 'regular' | 'special'
  globalHours: OfficeHour[]
  doctorHours: OfficeHour[]
  specialShifts: SpecialShift[]
  search: any
  navigate: any
  isLoading: boolean
}

export function MyScheduleTable({
  type,
  globalHours,
  doctorHours,
  specialShifts,
  search,
  navigate,
  isLoading,
}: MyScheduleTableProps) {
  // Aggregate data based on type
  const data = useMemo(() => {
    let items: ScheduleItem[] = []

    if (type === 'all' || type === 'regular') {
      const globalItems = globalHours.map((oh) => ({
        id: oh.id,
        dayOfWeek: oh.dayOfWeek,
        startTime: oh.startTime,
        endTime: oh.endTime,
        type: 'regular-global' as const,
      }))

      const docItems = doctorHours.map((oh) => ({
        id: oh.id,
        dayOfWeek: oh.dayOfWeek,
        startTime: oh.startTime,
        endTime: oh.endTime,
        type: 'regular-doctor' as const,
      }))

      items = [...items, ...globalItems, ...docItems]
    }

    if (type === 'all' || type === 'special') {
      const overrideItems = specialShifts.map((ss) => ({
        id: ss.id,
        date: ss.date,
        startTime: ss.startTime,
        endTime: ss.endTime,
        type: 'override' as const,
        reason: ss.reason,
        status: ss.status,
      }))
      items = [...items, ...overrideItems]
    }

    // Sort items logically
    return items.sort((a, b) => {
      // If one has date and other has dayOfWeek, overrides (dates) come first or last depending on preference
      // For simplicity, sort by date if available, then by dayOfWeek, then by startTime
      if (a.date && b.date) {
        if (a.date === b.date) return a.startTime.localeCompare(b.startTime)
        return a.date.localeCompare(b.date)
      }
      if (a.dayOfWeek !== undefined && b.dayOfWeek !== undefined) {
        if (a.dayOfWeek === b.dayOfWeek) return a.startTime.localeCompare(b.startTime)
        return a.dayOfWeek - b.dayOfWeek
      }
      if (a.date) return -1
      if (b.date) return 1
      return 0
    })
  }, [type, globalHours, doctorHours, specialShifts])

  const page = search.page || 1
  const limit = search.limit || 10
  const startIndex = (page - 1) * limit
  const paginatedData = data.slice(startIndex, startIndex + limit)

  return (
    <DataTable
      columns={myScheduleColumns}
      data={paginatedData}
      pageCount={Math.ceil(data.length / limit)}
      search={search}
      isLoading={isLoading}
      hideToolbar={true}
    />
  )
}
