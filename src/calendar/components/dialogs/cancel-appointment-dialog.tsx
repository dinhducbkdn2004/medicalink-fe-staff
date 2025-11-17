'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IAppointment } from '@/calendar/interfaces'
import {
  cancelAppointmentSchema,
  type TCancelAppointmentFormData,
} from '@/calendar/schemas'
import { AlertTriangle } from 'lucide-react'
import { appointmentService } from '@/api/services/appointment.service'
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

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function CancelAppointmentDialog({ children, appointment }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const queryClient = useQueryClient()

  const cancelMutation = useMutation({
    mutationFn: (data: TCancelAppointmentFormData) =>
      appointmentService.cancel(appointment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      onClose()
      form.reset()
    },
  })

  const form = useForm<TCancelAppointmentFormData>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: {
      reason: '',
    },
  })

  const onSubmit = (values: TCancelAppointmentFormData) => {
    cancelMutation.mutate(values)
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
              <span className='font-medium'>{appointment.doctor.name}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Date:</span>
              <span className='font-medium'>
                {appointment.event.serviceDate}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Time:</span>
              <span className='font-medium'>
                {appointment.event.timeStart} - {appointment.event.timeEnd}
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
            <Button
              type='button'
              variant='outline'
              disabled={cancelMutation.isPending}
            >
              Keep Appointment
            </Button>
          </DialogClose>

          <Button
            form='cancel-form'
            type='submit'
            variant='destructive'
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
