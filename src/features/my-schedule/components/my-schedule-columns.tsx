/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ColumnDef } from '@tanstack/react-table'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { getDayLabel } from '@/features/office-hours/data/schema'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export type ComputedScheduleItem = {
  id: string
  date: Date
  dayOfWeek: number
  startTime: string
  endTime: string
  type: 'global' | 'regular-doctor' | 'override' | 'none' | 'holiday'
  status: string
  reason?: string
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

export const myScheduleColumns: ColumnDef<ComputedScheduleItem>[] = [
  {
    id: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày' />
    ),
    cell: ({ row }) => {
      const item = row.original
      
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground size-4' />
          <span className='font-medium capitalize'>
            {format(item.date, 'EEEE, dd/MM', { locale: vi })}
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
    header: 'Thời gian',
    cell: ({ row }) => {
      const item = row.original
      
      if (item.status === 'OFF') {
        return (
          <Badge variant='outline' className='text-red-500 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'>
            Nghỉ
          </Badge>
        )
      }

      const startTime = formatTime(item.startTime)
      const endTime = formatTime(item.endTime)
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
    header: 'Loại',
    cell: ({ row }) => {
      const item = row.original
      let typeLabel: string
      let badgeClass: string

      if (item.type === 'none') {
        return <span className="text-muted-foreground text-sm">-</span>
      }

      if (item.type === 'override') {
        typeLabel = 'Ca đặc biệt'
        badgeClass = 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
      } else if (item.type === 'holiday') {
        typeLabel = 'Ngày nghỉ phòng khám'
        badgeClass = 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300'
      } else if (item.type === 'regular-doctor') {
        typeLabel = 'Giờ riêng của Bác sĩ'
        badgeClass = 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
      } else {
        typeLabel = 'Giờ chung phòng khám'
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
    header: 'Chi tiết / Lý do',
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
