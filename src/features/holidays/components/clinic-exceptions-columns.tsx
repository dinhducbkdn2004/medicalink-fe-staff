import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type ClinicException } from '../data/schema'

export const clinicExceptionsColumns: ColumnDef<ClinicException>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return <div className='font-medium'>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'scope',
    header: 'Scope',
    cell: ({ row }) => {
      const workLocation = row.original.workLocation
      return workLocation ? (
        <Badge variant='outline'>{workLocation.name}</Badge>
      ) : (
        <Badge
          variant='default'
          className='bg-destructive text-destructive-foreground'
        >
          Global Holiday
        </Badge>
      )
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const { isFullDay, startTime, endTime } = row.original
      if (isFullDay) return <Badge variant='secondary'>Full Day</Badge>
      return (
        <span className='text-muted-foreground text-sm'>
          {startTime?.slice(0, 5)} - {endTime?.slice(0, 5)}
        </span>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => {
      return <span>{row.original.reason || '-'}</span>
    },
  },
]
