import { type ColumnDef } from '@tanstack/react-table'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { getDayLabel } from '@/features/office-hours/data/schema'
import type { OfficeHour } from '@/features/office-hours/data/schema'
import type { SpecialShift } from '@/features/special-shifts/data/schema'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ScheduleItem = {
  id: string
  dayOfWeek?: number
  date?: string
  startTime: string
  endTime: string
  type: 'regular-global' | 'regular-doctor' | 'override'
  reason?: string
  status?: string
}

function formatTime(timeString: string): string {
  try {
    if (timeString.includes('T')) {
      const date = new Date(timeString)
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return timeString
  } catch {
    return timeString
  }
}

export const myScheduleColumns: ColumnDef<ScheduleItem>[] = [
  {
    id: 'dateOrDay',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Day / Date' />
    ),
    cell: ({ row }) => {
      const item = row.original
      const isOverride = item.type === 'override'
      
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground size-4' />
          <span className='font-medium'>
            {isOverride && item.date 
              ? dayjs(item.date).format('MMM DD, YYYY') 
              : getDayLabel(item.dayOfWeek ?? -1)}
          </span>
        </div>
      )
    },
    meta: {
      className: 'min-w-[140px]',
    },
  },
  {
    id: 'timeRange',
    header: 'Time Range',
    cell: ({ row }) => {
      const startTime = formatTime(row.original.startTime)
      const endTime = formatTime(row.original.endTime)
      return (
        <div className='flex items-center gap-2'>
          <Clock className='text-muted-foreground size-4' />
          <span className='font-mono text-sm'>
            {startTime} - {endTime}
          </span>
        </div>
      )
    },
    meta: {
      className: 'min-w-[160px]',
    },
  },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const item = row.original
      let typeLabel: string
      let badgeClass: string

      if (item.type === 'override') {
        typeLabel = 'Special Shift'
        badgeClass = 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
      } else if (item.type === 'regular-doctor') {
        typeLabel = 'My Regular Hours'
        badgeClass = 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
      } else {
        typeLabel = 'Clinic Global Hours'
        badgeClass = 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
      }

      return (
        <Badge variant='outline' className={cn('font-normal', badgeClass)}>
          {typeLabel}
        </Badge>
      )
    },
    meta: {
      className: 'min-w-[150px]',
    },
  },
  {
    id: 'details',
    header: 'Details / Reason',
    cell: ({ row }) => {
      const item = row.original
      if (!item.reason) return <span className="text-muted-foreground">-</span>

      return (
        <div className='flex items-center gap-2 max-w-[200px] truncate'>
          <AlertCircle className='text-muted-foreground size-4 shrink-0' />
          <span className='text-sm truncate'>{item.reason}</span>
        </div>
      )
    },
    meta: {
      className: 'min-w-[150px]',
    },
  },
]
