import { format } from 'date-fns'
import { Calendar, Clock, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSpecialShifts } from '../data/use-special-shifts'
import { SpecialShiftsDialogs } from './special-shifts-dialogs'
import { SpecialShiftsProvider, useSpecialShiftsContext } from './special-shifts-provider'

function SpecialShiftsWidgetContent({ doctorId }: { doctorId: string }) {
  const { setOpen } = useSpecialShiftsContext()
  const { data: shifts, isLoading } = useSpecialShifts({ doctorId })

  const upcomingShifts = shifts
    ?.filter((shift) => new Date(shift.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className='pb-3 flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='text-base'>Upcoming Special Shifts</CardTitle>
          <CardDescription className='text-xs'>
            Overrides and extra shifts for this doctor
          </CardDescription>
        </div>
        <Button variant='outline' size='sm' onClick={() => setOpen('create')}>
          <Plus className='mr-2 size-4' />
          Add Shift
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center p-4'>
            <span className='text-muted-foreground text-sm'>Loading...</span>
          </div>
        ) : upcomingShifts && upcomingShifts.length > 0 ? (
          <div className='space-y-3'>
            {upcomingShifts.map((shift) => (
              <div
                key={shift.id}
                className='flex flex-col gap-1 rounded-md border p-3 text-sm'
              >
                <div className='flex items-center justify-between font-medium'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='size-4 text-primary' />
                    {format(new Date(shift.date), 'MMM dd, yyyy')}
                  </div>
                  <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Clock className='size-3' />
                    {shift.startTime.slice(0, 5)} - {shift.endTime.slice(0, 5)}
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <MapPin className='size-3 text-muted-foreground' />
                  <span className='text-xs text-muted-foreground'>
                    {shift.workLocation?.name || 'All Locations'}
                  </span>
                </div>
                {shift.reason && (
                  <p className='mt-1 text-xs text-muted-foreground italic'>
                    Note: {shift.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground flex items-center justify-center gap-2 p-4 text-xs italic'>
            No upcoming special shifts scheduled
          </div>
        )}
      </CardContent>

      <SpecialShiftsDialogs defaultDoctorId={doctorId} />
    </Card>
  )
}

export function SpecialShiftsWidget({ doctorId }: { doctorId: string }) {
  return (
    <SpecialShiftsProvider>
      <SpecialShiftsWidgetContent doctorId={doctorId} />
    </SpecialShiftsProvider>
  )
}
