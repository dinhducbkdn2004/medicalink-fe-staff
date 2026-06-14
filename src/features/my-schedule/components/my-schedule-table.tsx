import { useMemo } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { myScheduleColumns, type ComputedScheduleItem } from './my-schedule-columns'
import type { OfficeHour } from '@/features/office-hours/data/schema'
import type { SpecialShift } from '@/features/special-shifts/data/schema'
import type { ClinicException } from '@/features/holidays/data/schema'
import type { SearchParams } from '@/types/common.types'
import { addDays, format, getDay, isBefore, isSameDay, parseISO } from 'date-fns'

interface MyScheduleTableProps {
  startDate: Date
  endDate: Date
  globalHours: OfficeHour[]
  doctorHours: OfficeHour[]
  specialShifts: SpecialShift[]
  clinicExceptions: ClinicException[]
  search: SearchParams
  navigate: (opts: any) => void
  isLoading?: boolean
}

export function MyScheduleTable({
  startDate,
  endDate,
  globalHours,
  doctorHours,
  specialShifts,
  clinicExceptions,
  search,
  navigate,
  isLoading,
}: MyScheduleTableProps) {
  // Aggregate data based on type
  const data = useMemo(() => {
    const computedData: ComputedScheduleItem[] = []
    let currentDate = startDate

    while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      // date-fns getDay: 0=Sunday, 1=Monday. In our DB: 1=Monday... 7=Sunday
      let dayOfWeek = getDay(currentDate)
      if (dayOfWeek === 0) dayOfWeek = 7

      // 1. Check Special Shifts for this exact date
      const dateSpecialShifts = specialShifts.filter((ss) => {
        const ssDate = ss.effectiveDate ? format(parseISO(ss.effectiveDate), 'yyyy-MM-dd') : null
        return ssDate === dateStr
      })

      if (dateSpecialShifts.length > 0) {
        // We have special shifts overriding this day
        dateSpecialShifts.forEach((ss) => {
          computedData.push({
            id: `special-${ss.id}`,
            date: currentDate,
            dayOfWeek,
            startTime: ss.startTime,
            endTime: ss.endTime,
            status: ss.status || 'WORKING',
            type: 'override',
            reason: ss.reason,
          })
        })
      } else {
        // Check Clinic Exceptions (Holidays)
        const dateClinicExceptions = clinicExceptions.filter((ce) => {
          const ceDate = ce.date ? format(parseISO(ce.date), 'yyyy-MM-dd') : null
          return ceDate === dateStr
        })

        if (dateClinicExceptions.length > 0) {
          // It's a holiday! Overrides normal hours
          dateClinicExceptions.forEach((ce) => {
            computedData.push({
              id: `holiday-${ce.id}`,
              date: currentDate,
              dayOfWeek,
              startTime: ce.startTime || '',
              endTime: ce.endTime || '',
              status: 'OFF',
              type: 'holiday',
              reason: ce.reason || 'Clinic Holiday',
            })
          })
        } else {
          // 2. Check Doctor Specific Hours
          const dateDoctorHours = doctorHours.filter((oh) => oh.dayOfWeek === dayOfWeek)
          
          if (dateDoctorHours.length > 0) {
            dateDoctorHours.forEach((oh) => {
              computedData.push({
                id: `doctor-${oh.id}`,
                date: currentDate,
                dayOfWeek,
                startTime: oh.startTime,
                endTime: oh.endTime,
                status: 'WORKING',
                type: 'regular-doctor',
              })
            })
          } else {
            // 3. Check Global Hours
            const dateGlobalHours = globalHours.filter((oh) => oh.dayOfWeek === dayOfWeek)
            
            if (dateGlobalHours.length > 0) {
              dateGlobalHours.forEach((oh) => {
                computedData.push({
                  id: `global-${oh.id}`,
                  date: currentDate,
                  dayOfWeek,
                  startTime: oh.startTime,
                  endTime: oh.endTime,
                  status: 'WORKING',
                  type: 'global',
                })
              })
            } else {
              // 4. Off
              computedData.push({
                id: `off-${dateStr}`,
                date: currentDate,
                dayOfWeek,
                startTime: '',
                endTime: '',
                status: 'OFF',
                type: 'none',
              })
            }
          }
        }
      }

      currentDate = addDays(currentDate, 1)
    }

    return computedData
  }, [startDate, endDate, globalHours, doctorHours, specialShifts, clinicExceptions])

  // Sorting
  const sortedData = useMemo(() => {
    const sortField = search.sortBy as keyof ComputedScheduleItem | undefined
    const sortOrder = search.sortOrder || 'asc'
    if (!sortField) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]

      if (aVal === bVal) return 0
      
      const comparison = aVal < bVal ? -1 : 1
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [data, search.sortBy, search.sortOrder])

  // Pagination (client-side since we compute the whole range)
  const page = search.page || 1
  const limit = search.limit || 50
  
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit
    return sortedData.slice(startIndex, startIndex + limit)
  }, [sortedData, page, limit])

  return (
    <DataTable
      columns={myScheduleColumns}
      data={paginatedData}
      pageCount={Math.ceil(sortedData.length / limit)}
      search={search}
      navigate={navigate}
      isLoading={isLoading}
      hideToolbar={true}
    />
  )
}
