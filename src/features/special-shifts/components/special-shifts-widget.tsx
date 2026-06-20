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
    ?.filter((shift) => new Date(shift.effectiveDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className='pb-3 flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='text-base'>Ca làm việc đặc biệt sắp tới</CardTitle>
          <CardDescription className='text-xs'>
            Các ca ngoại lệ và làm thêm của bác sĩ này
          </CardDescription>
        </div>
        <Button variant='outline' size='sm' onClick={() => setOpen('create')}>
          <Plus className='mr-2 size-4' />
          Thêm ca làm việc
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center p-4'>
            <span className='text-muted-foreground text-sm'>Đang tải...</span>
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
                    {format(new Date(shift.effectiveDate), 'MMM dd, yyyy')}
                  </div>
                  <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Clock className='size-3' />
                    {shift.startTime.slice(0, 5)} - {shift.endTime.slice(0, 5)}
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <MapPin className='size-3 text-muted-foreground' />
                  <span className='text-xs text-muted-foreground'>
                    {shift.workLocation?.name || 'Tất cả cơ sở'}
                  </span>
                </div>
                {shift.reason && (
                  <p className='mt-1 text-xs text-muted-foreground italic'>
                    Ghi chú: {shift.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground flex items-center justify-center gap-2 p-4 text-xs italic'>
            Không có ca làm việc đặc biệt nào sắp tới
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
