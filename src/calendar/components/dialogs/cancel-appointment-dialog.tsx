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

/**
 * Format time string (HH:mm or ISO) to HH:mm format
 */
const formatTime = (timeStr: string): string => {
  if (timeStr.includes('T')) {
    // ISO timestamp like "1970-01-01T16:30:00.000Z"
    const timePart = timeStr.split('T')[1]
    const [hour, minute] = timePart.split(':').map(Number)
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
  // Already in HH:mm format
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
            Cancel Appointment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this appointment? This action will
            update the appointment status to "Cancelled by Staff".
          </DialogDescription>
        </DialogHeader>

        <div className='py-2'>
          <div className='bg-muted mb-4 space-y-2 rounded-lg p-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Patient:</span>
              <span className='font-medium'>
                {appointment.patient.fullName}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Doctor:</span>
              <span className='font-medium'>
                {appointment.doctor?.name || 'Deleted Doctor'}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Date:</span>
              <span className='font-medium'>
                {format(
                  parseISO(appointment.event.serviceDate),
                  'MMMM dd, yyyy'
                )}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Time:</span>
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
                    <FormLabel>Cancellation Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Enter the reason for cancellation...'
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
              Keep Appointment
            </Button>
          </DialogClose>

          <Button
            form='cancel-form'
            type='submit'
            variant='destructive'
            disabled={isPending}
          >
            {isPending ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
