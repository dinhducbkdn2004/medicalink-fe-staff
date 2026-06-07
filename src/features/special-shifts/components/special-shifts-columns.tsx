import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type SpecialShift } from '../data/schema'
import { format } from 'date-fns'

export const specialShiftsColumns: ColumnDef<SpecialShift>[] = [
  {
    accessorKey: 'doctor',
    header: 'Doctor',
    cell: ({ row }) => {
      const doctor = row.original.doctor
      return (
        <div className="font-medium">
          Dr. {doctor?.firstName} {doctor?.lastName}
        </div>
      )
    },
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.effectiveDate)
      return <div>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const { startTime, endTime } = row.original
      return (
        <span className="text-muted-foreground text-sm">
          {startTime.slice(0, 5)} - {endTime.slice(0, 5)}
        </span>
      )
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const workLocation = row.original.workLocation
      return workLocation ? (
        <Badge variant="outline">{workLocation.name}</Badge>
      ) : (
        <Badge variant="secondary">All Locations</Badge>
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
