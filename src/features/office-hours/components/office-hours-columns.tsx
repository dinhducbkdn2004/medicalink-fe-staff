/**
 * Office Hours Table Columns
 * Column definitions for office hours data table
 * Simplified to match API capabilities (no edit, no bulk actions)
 */
import { type ColumnDef } from '@tanstack/react-table'
import { Clock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  type OfficeHour,
  getDayLabel,
} from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

// Helper to format time from ISO DateTime to HH:mm
function formatTime(timeString: string): string {
  try {
    // Handle both ISO DateTime and HH:mm formats
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

export const officeHoursColumns: ColumnDef<OfficeHour>[] = [
  {
    accessorKey: 'dayOfWeek',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Day of Week' />
    ),
    cell: ({ row }) => {
      const dayOfWeek = row.original.dayOfWeek
      return (
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground size-4' />
          <span className='font-medium'>{getDayLabel(dayOfWeek)}</span>
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
      const officeHour = row.original
      let _type: string
      let typeLabel: string
      let badgeClass: string

      // Determine type based on the 4 categories
      if (officeHour.doctorId && officeHour.workLocationId) {
        _type = 'doctorInLocation'
        typeLabel = 'Doctor + Location'
        badgeClass =
          'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
      } else if (officeHour.doctorId && !officeHour.workLocationId) {
        _type = 'doctor'
        typeLabel = 'Doctor Only'
        badgeClass =
          'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
      } else if (!officeHour.doctorId && officeHour.workLocationId) {
        _type = 'workLocation'
        typeLabel = 'Location Only'
        badgeClass =
          'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
      } else {
        _type = 'global'
        typeLabel = 'Global'
        badgeClass =
          'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div className='text-muted-foreground text-sm'>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
    meta: {
      className: 'w-[140px]',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-[60px] sticky right-0 bg-background',
    },
  },
]
