import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type SpecialShift } from '../data/schema'
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
      const startTime = formatTime(row.original.startTime)
      const endTime = formatTime(row.original.endTime)
      return (
        <span className="text-muted-foreground text-sm font-mono">
          {startTime} - {endTime}
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
