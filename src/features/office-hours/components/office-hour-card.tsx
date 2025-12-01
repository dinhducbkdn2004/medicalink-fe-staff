import { format } from 'date-fns'
import { Trash2, Clock, MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type OfficeHour } from '../data/schema'
import { useOfficeHoursContext } from './office-hours-provider'

interface OfficeHourCardProps {
  officeHour: OfficeHour
}

export function OfficeHourCard({ officeHour }: Readonly<OfficeHourCardProps>) {
  const { setOpen, setCurrentRow } = useOfficeHoursContext()

  const handleDelete = () => {
    setCurrentRow(officeHour)
    setOpen('delete')
  }

  // Format time to be more readable (e.g. 08:00 -> 8:00 AM)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return format(date, 'h:mm a')
  }

  const isGlobal = officeHour.isGlobal
  const isDoctorSpecific = !!officeHour.doctorId
  const isLocationSpecific = !!officeHour.workLocationId

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md',
        isGlobal &&
          'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/10',
        isDoctorSpecific &&
          !isLocationSpecific &&
          'border-purple-200 bg-purple-50/30 dark:border-purple-800 dark:bg-purple-950/10',
        isLocationSpecific &&
          !isDoctorSpecific &&
          'border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-950/10'
      )}
    >
      <CardHeader className='p-3 pb-0'>
        <div className='flex items-center justify-between'>
          <Badge
            variant='outline'
            className={cn(
              'text-[10px] font-normal',
              isGlobal &&
                'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300',
              isDoctorSpecific &&
                !isLocationSpecific &&
                'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300',
              isLocationSpecific &&
                !isDoctorSpecific &&
                'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300',
              isDoctorSpecific &&
                isLocationSpecific &&
                'border-green-200 text-green-700 dark:border-green-800 dark:text-green-300'
            )}
          >
            {(() => {
              if (isGlobal) return 'Global'
              if (isDoctorSpecific && isLocationSpecific) return 'Dr. & Loc'
              if (isDoctorSpecific) return 'Doctor'
              return 'Location'
            })()}
          </Badge>
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-destructive h-6 w-6'
            onClick={handleDelete}
          >
            <Trash2 className='h-3.5 w-3.5' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-3 pt-2'>
        <div className='flex items-center gap-1.5 text-sm font-semibold'>
          <Clock className='text-muted-foreground h-3.5 w-3.5' />
          <span>
            {formatTime(officeHour.startTime)} -{' '}
            {formatTime(officeHour.endTime)}
          </span>
        </div>

        {(isDoctorSpecific || isLocationSpecific) && (
          <div className='mt-2 space-y-1'>
            {isDoctorSpecific && officeHour.doctor && (
              <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <User className='h-3 w-3' />
                <span
                  className='max-w-[120px] truncate'
                  title={officeHour.doctor.name}
                >
                  {officeHour.doctor.name}
                </span>
              </div>
            )}
            {isLocationSpecific && officeHour.workLocation && (
              <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <MapPin className='h-3 w-3' />
                <span
                  className='max-w-[120px] truncate'
                  title={officeHour.workLocation.name}
                >
                  {officeHour.workLocation.name}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
