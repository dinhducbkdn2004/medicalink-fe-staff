import { format, parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IAppointment } from '@/calendar/interfaces'
import {
  cancelAppointmentSchema,
  type TCancelAppointmentFormData,
} from '@/calendar/schemas'
import { AlertTriangle } from 'lucide-react'
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
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useCancelAppointment } from '@/features/appointments/data/hooks'


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

export function CancelAppointmentDialog({ children, appointment }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()

  const { mutate: cancelAppointment, isPending } = useCancelAppointment()

  const form = useForm<TCancelAppointmentFormData>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: {
      reason: '',
    },
  })

  const onSubmit = (values: TCancelAppointmentFormData) => {
    cancelAppointment(
      { id: appointment.id, data: values },
      {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      }
    )
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
            <AlertTriangle className='text-destructive size-5' />
            Hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này sẽ cập nhật trạng thái lịch hẹn thành "Đã hủy bởi Nhân viên".
          </DialogDescription>
        </DialogHeader>

        <div className='py-2'>
          <div className='bg-muted mb-4 space-y-2 rounded-lg p-4'>
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

          <Form {...form}>
            <form
              id='cancel-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='reason'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Lý do hủy (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Nhập lý do hủy lịch hẹn...'
                        rows={3}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isPending}>
              Giữ lại lịch hẹn
            </Button>
          </DialogClose>

          <Button
            form='cancel-form'
            type='submit'
            variant='destructive'
            disabled={isPending}
          >
            {isPending ? 'Đang hủy...' : 'Hủy lịch hẹn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
