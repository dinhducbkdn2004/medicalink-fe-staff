import { format, parseISO } from 'date-fns'
import { formatShiftTime } from '@/lib/utils'
import type { IAppointment } from '@/calendar/interfaces'
import { CheckCircle2 } from 'lucide-react'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useCompleteAppointment } from '@/features/appointments/data/hooks'

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function CompleteAppointmentDialog({
  children,
  appointment,
}: Readonly<IProps>) {
  const { isOpen, onClose, onToggle } = useDisclosure()

  const { mutate: completeAppointment, isPending } = useCompleteAppointment()

  const handleComplete = () => {
    completeAppointment(appointment.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  if (!appointment?.event) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle2 className='size-5 text-green-600' />
            Đánh dấu hoàn thành lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn đánh dấu lịch hẹn này đã hoàn thành? Hành động này sẽ cập nhật trạng thái lịch hẹn và lưu thời gian hoàn thành.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='bg-muted space-y-2 rounded-lg p-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Bệnh nhân:</span>
              <span className='font-medium'>
                {appointment.patient.fullName}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Bác sĩ:</span>
              <span className='font-medium'>
                {appointment.doctor?.name || 'Bác sĩ đã bị xóa'}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Ngày:</span>
              <span className='font-medium'>
                {format(
                  parseISO(appointment.event.serviceDate),
                  'MMMM dd, yyyy'
                )}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Giờ:</span>
              <span className='font-medium'>
                {formatShiftTime(appointment.event.timeStart)} - {formatShiftTime(appointment.event.timeEnd)}
              </span>
            </div>
            {appointment.reason && (
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Lý do khám:</span>
                <span className='font-medium'>{appointment.reason}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isPending}>
              Hủy
            </Button>
          </DialogClose>

          <Button type='button' onClick={handleComplete} disabled={isPending}>
            {isPending ? 'Đang cập nhật...' : 'Đánh dấu hoàn thành'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
