import { format, parseISO } from 'date-fns'
import type { IAppointment } from '@/calendar/interfaces'
import { CheckCircle } from 'lucide-react'
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
import { useConfirmAppointment } from '@/features/appointments/data/hooks'


const formatTime = (timeStr: string): string => {
  if (timeStr.includes('T')) {
    
    const timePart = timeStr.split('T')[1]
    const [hour, minute] = timePart.split(':').map(Number)
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
  
  return timeStr
}

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function ConfirmAppointmentDialog({
  children,
  appointment,
}: Readonly<IProps>) {
  const { isOpen, onClose, onToggle } = useDisclosure()

  const { mutate: confirmAppointment, isPending } = useConfirmAppointment()

  const handleConfirm = () => {
    confirmAppointment(appointment.id, {
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
            <CheckCircle className='size-5 text-green-600' />
            Xác nhận lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xác nhận lịch hẹn này?
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
                {formatTime(appointment.event.timeStart)} -{' '}
                {formatTime(appointment.event.timeEnd)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Hủy
            </Button>
          </DialogClose>

          <Button type='button' onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Đang xác nhận...' : 'Xác nhận lịch hẹn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
