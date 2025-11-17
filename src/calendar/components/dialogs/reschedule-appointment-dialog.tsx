'use client'

import { parseISO, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IAppointment } from '@/calendar/interfaces'
import {
  rescheduleAppointmentSchema,
  type TRescheduleAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeValue } from 'react-aria-components'
import { appointmentService } from '@/api/services/appointment.service'
import type { RescheduleAppointmentRequest } from '@/api/types/appointment.types'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { TimeInput } from '@/components/ui/time-input'

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function RescheduleAppointmentDialog({
  children,
  appointment,
}: Readonly<IProps>) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const queryClient = useQueryClient()

  // Extract default values before conditional return
  const serviceDate = appointment?.event
    ? parseISO(appointment.event.serviceDate)
    : new Date()
  const [timeStartHour, timeStartMinute] = appointment?.event?.timeStart
    ? appointment.event.timeStart.split(':').map(Number)
    : [9, 0]
  const [timeEndHour, timeEndMinute] = appointment?.event?.timeEnd
    ? appointment.event.timeEnd.split(':').map(Number)
    : [10, 0]

  // Move useForm hook before conditional return
  const form = useForm<TRescheduleAppointmentFormData>({
    resolver: zodResolver(rescheduleAppointmentSchema),
    defaultValues: {
      doctorId: appointment?.doctorId || '',
      locationId: appointment?.locationId || '',
      serviceDate: serviceDate,
      timeStart: { hour: timeStartHour, minute: timeStartMinute },
      timeEnd: { hour: timeEndHour, minute: timeEndMinute },
      autoconfirm: false,
    },
  })

  const rescheduleMutation = useMutation({
    mutationFn: (data: TRescheduleAppointmentFormData) =>
      appointmentService.reschedule(appointment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      onClose()
      form.reset()
    },
  })

  // Now safe to do conditional return after all hooks
  if (!appointment?.event) {
    return null
  }

  const onSubmit = (values: TRescheduleAppointmentFormData) => {
    const requestData: RescheduleAppointmentRequest = {
      ...values,
      serviceDate: values.serviceDate
        ? format(values.serviceDate, 'yyyy-MM-dd')
        : undefined,
      timeStart: values.timeStart
        ? `${String(values.timeStart.hour).padStart(2, '0')}:${String(values.timeStart.minute).padStart(2, '0')}`
        : undefined,
      timeEnd: values.timeEnd
        ? `${String(values.timeEnd.hour).padStart(2, '0')}:${String(values.timeEnd.minute).padStart(2, '0')}`
        : undefined,
    }
    rescheduleMutation.mutate(requestData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Update the appointment date, time, doctor, or location.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='reschedule-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-4 py-4'
          >
            <FormField
              control={form.control}
              name='doctorId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder='Select a doctor' />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: Load doctors from API */}
                        <SelectItem value={appointment.doctorId}>
                          {appointment.doctor.name}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='locationId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder='Select a location' />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: Load locations from API */}
                        <SelectItem value={appointment.locationId}>
                          {appointment.location?.name || 'Current Location'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='serviceDate'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='serviceDate'>Service Date</FormLabel>
                  <FormControl>
                    <SingleDayPicker
                      id='serviceDate'
                      value={field.value}
                      onSelect={(date) => field.onChange(date as Date)}
                      placeholder='Select a date'
                      data-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-start gap-2'>
              <FormField
                control={form.control}
                name='timeStart'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={24}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='timeEnd'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={24}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='autoconfirm'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      Auto-confirm appointment after rescheduling
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              disabled={rescheduleMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            form='reschedule-form'
            type='submit'
            disabled={rescheduleMutation.isPending}
          >
            {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
