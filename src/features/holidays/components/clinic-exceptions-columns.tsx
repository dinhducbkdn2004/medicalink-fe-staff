import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type ClinicException } from '../data/schema'

export const clinicExceptionsColumns: ColumnDef<ClinicException>[] = [
  {
    accessorKey: 'date',
    header: 'Ngày',
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return <div className='font-medium'>{date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}</div>
    },
  },
  {
    accessorKey: 'scope',
    header: 'Phạm vi',
    cell: ({ row }) => {
      const workLocation = row.original.workLocation
      return workLocation ? (
        <Badge variant='outline'>{workLocation.name}</Badge>
      ) : (
        <Badge
          variant='default'
          className='bg-destructive text-destructive-foreground'
        >
          Ngày lễ toàn hệ thống
        </Badge>
      )
    },
  },
  {
    accessorKey: 'time',
    header: 'Thời gian',
    cell: ({ row }) => {
      const { isFullDay, startTime, endTime } = row.original
      if (isFullDay) return <Badge variant='secondary'>Cả ngày</Badge>
      return (
        <span className='text-muted-foreground text-sm'>
          {startTime?.slice(0, 5)} - {endTime?.slice(0, 5)}
        </span>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => {
      return <span>{row.original.reason || '-'}</span>
    },
  },
]
