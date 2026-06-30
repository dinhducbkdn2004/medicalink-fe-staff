
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
import { format } from 'date-fns'


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

export const officeHoursColumns: ColumnDef<OfficeHour>[] = [
  {
    accessorKey: 'dayOfWeek',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày trong tuần' />
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
    header: 'Thời gian',
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
    header: 'Loại',
    cell: ({ row }) => {
      const officeHour = row.original
      let _type: string
      let typeLabel: string
      let badgeClass: string

      if (officeHour.isGlobal) {
        _type = 'global'
        typeLabel = 'Giờ chung phòng khám'
        badgeClass =
          'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
      } else {
        _type = 'doctor'
        typeLabel = 'Giờ riêng của Bác sĩ'
        badgeClass =
          'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
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
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div className='text-muted-foreground text-sm'>
          {format(date, 'dd/MM/yyyy')}
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
