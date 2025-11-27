import { useEffect } from 'react'
import { parseISO, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useDoctorsBySpecialty,
  useLocationsByDoctor,
} from '@/calendar/hooks/use-appointment-form-data'
import type { IAppointment } from '@/calendar/interfaces'
import {
  rescheduleAppointmentSchema,
  type TRescheduleAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeValue } from 'react-aria-components'
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
import { useRescheduleAppointment } from '@/features/appointments/data/hooks'

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function RescheduleAppointmentDialog({
  children,
  appointment,
}: Readonly<IProps>) {
  const { isOpen, onClose, onToggle } = useDisclosure()

  const { mutate: rescheduleAppointment, isPending } =
    useRescheduleAppointment()

  // Extract default values
  const serviceDate = appointment?.event
    ? parseISO(appointment.event.serviceDate)
    : new Date()
  const [timeStartHour, timeStartMinute] = appointment?.event?.timeStart
    ? appointment.event.timeStart.split(':').map(Number)
    : [9, 0]
  const [timeEndHour, timeEndMinute] = appointment?.event?.timeEnd
    ? appointment.event.timeEnd.split(':').map(Number)
    : [10, 0]

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

  // Watch doctorId to fetch locations
  const selectedDoctorId = form.watch('doctorId')

  // Fetch doctors based on appointment specialty
  const { doctors, isLoading: isLoadingDoctors } = useDoctorsBySpecialty(
    appointment?.specialtyId
  )

  // Fetch locations based on selected doctor
  const { locations, isLoading: isLoadingLocations } =
    useLocationsByDoctor(selectedDoctorId)

  // Reset location if doctor changes (optional, but good UX)
  // However, initially we want to keep the existing location if doctor hasn't changed.
  // We can skip this for now or handle it carefully.
  // Let's just ensure if user changes doctor, they should pick a location.
  useEffect(() => {
    if (isOpen && selectedDoctorId !== appointment.doctorId) {
      // If doctor changed from original, maybe reset location?
      // But for now let's keep it simple.
    }
  }, [selectedDoctorId, isOpen, appointment.doctorId])

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

    rescheduleAppointment(
      { id: appointment.id, data: requestData },
      {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      }
    )
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
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val)
                        form.setValue('locationId', '') // Reset location when doctor changes
                      }}
                      disabled={isLoadingDoctors}
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue
                          placeholder={
                            isLoadingDoctors ? 'Loading...' : 'Select a doctor'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.fullName}
                          </SelectItem>
                        ))}
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedDoctorId || isLoadingLocations}
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue
                          placeholder={
                            isLoadingLocations
                              ? 'Loading...'
                              : 'Select a location'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
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
            <Button type='button' variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button form='reschedule-form' type='submit' disabled={isPending}>
            {isPending ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
