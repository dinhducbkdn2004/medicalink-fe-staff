/**
 * Office Hours Table Columns
 * Column definitions for office hours data table
 * Simplified to match API capabilities (no edit, no bulk actions)
 */
import { type ColumnDef } from '@tanstack/react-table'
import { Clock, MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  type OfficeHour,
  getDayLabel,
  getOfficeHoursType,
  getOfficeHoursTypeLabel,
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
    id: 'workLocation',
    header: 'Work Location',
    cell: ({ row }) => {
      const workLocation = row.original.workLocation
      const workLocationId = row.original.workLocationId

      if (!workLocationId) {
        return (
          <span className='text-muted-foreground text-sm'>All Locations</span>
        )
      }

      return (
        <div className='flex items-center gap-2'>
          <MapPin className='text-muted-foreground size-4' />
          <span className='truncate max-w-[120px] text-sm' title={workLocation?.name || `ID: ${workLocationId}`}>
            {workLocation ? workLocation.name : `ID: ${workLocationId}`}
          </span>
        </div>
      )
    },
    meta: {
      className: 'min-w-[180px]',
    },
  },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = getOfficeHoursType(row.original)
      const typeLabel = getOfficeHoursTypeLabel(type)
      const isGlobal = row.original.isGlobal

      return (
        <div className='flex flex-col gap-1'>
          <Badge
            variant='outline'
            className={cn(
              'font-normal',
              type === 'doctor-at-location' &&
                'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
              type === 'doctor-all-locations' &&
                'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
              type === 'global-location' &&
                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
            )}
          >
            {typeLabel}
          </Badge>
          {isGlobal && (
            <Badge variant='secondary' className='text-xs'>
              Global
            </Badge>
          )}
        </div>
      )
    },
    meta: {
      className: 'min-w-[200px]',
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
