import { useEffect, useState } from 'react'
import { parseISO, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppointmentSchedulerDialog } from '@/calendar/components/dialogs/appointment-scheduler-dialog'
import {
  useDoctorsBySpecialty,
  useLocationsByDoctor,
  useDoctorAvailableDates,
  useAvailableSlots,
} from '@/calendar/hooks/use-appointment-form-data'
import type { IAppointment } from '@/calendar/interfaces'
import {
  rescheduleAppointmentSchema,
  type TRescheduleAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeSlot } from '@/api/services/doctor-profile.service'
import type { RescheduleAppointmentRequest } from '@/api/types/appointment.types'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
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
import { useRescheduleAppointment } from '@/features/appointments/data/hooks'

interface IProps {
  appointment: IAppointment
  onCancel: () => void
  onSuccess: () => void
}

export function AppointmentRescheduleForm({
  appointment,
  onCancel,
  onSuccess,
}: IProps) {
  const { mutate: rescheduleAppointment, isPending } =
    useRescheduleAppointment()

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(
    undefined
  )

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
    // @ts-expect-error - Zod v4 type compatibility issue with zodResolver
    resolver: zodResolver(rescheduleAppointmentSchema),
    defaultValues: {
      doctorId: appointment?.doctorId || '',
      locationId: appointment?.locationId || '',
      serviceDate: serviceDate,
      timeStart: { hour: timeStartHour, minute: timeStartMinute },
      timeEnd: { hour: timeEndHour, minute: timeEndMinute },
    },
  })

  // Watch values for fetching slots
  const selectedDoctorId = form.watch('doctorId')
  const selectedLocationId = form.watch('locationId')
  const selectedDate = form.watch('serviceDate')

  // Fetch doctors based on appointment specialty
  const { doctors, isLoading: isLoadingDoctors } = useDoctorsBySpecialty(
    appointment?.specialtyId
  )

  // Fetch locations based on selected doctor
  const { locations, isLoading: isLoadingLocations } =
    useLocationsByDoctor(selectedDoctorId)

  // Fetch available dates
  const { availableDates, isLoading: isLoadingDates } = useDoctorAvailableDates(
    selectedDoctorId,
    selectedLocationId
  )

  // Fetch available slots for selected date
  const { slots, isLoading: isLoadingSlots } = useAvailableSlots(
    selectedDoctorId,
    selectedLocationId,
    selectedDate
  )

  // Get user role for allowPast
  const user = useAuthStore((state) => state.user)
  const allowPastDates = user
    ? user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
    : false

  // Reset location if doctor changes
  useEffect(() => {
    if (
      selectedDoctorId !== appointment.doctorId &&
      form.getValues('locationId')
    ) {
      form.setValue('locationId', '')
    }
  }, [selectedDoctorId, appointment.doctorId, form])

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
          onSuccess()
          form.reset()
        },
      }
    )
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    const [startHour, startMinute] = slot.timeStart.split(':').map(Number)
    const [endHour, endMinute] = slot.timeEnd.split(':').map(Number)

    form.setValue('timeStart', { hour: startHour, minute: startMinute })
    form.setValue('timeEnd', { hour: endHour, minute: endMinute })
    form.trigger(['timeStart', 'timeEnd'])
  }

  return (
    <Form {...form}>
      <form
        id='reschedule-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <div className='grid gap-6 md:grid-cols-2'>
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
                    }}
                    disabled={isLoadingDoctors}
                  >
                    <SelectTrigger
                      data-invalid={fieldState.invalid}
                      className='w-full truncate'
                    >
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
                    <SelectTrigger
                      data-invalid={fieldState.invalid}
                      className='w-full truncate'
                    >
                      <SelectValue
                        placeholder={
                          isLoadingLocations
                            ? 'Loading...'
                            : 'Select a location'
                        }
                        className='truncate'
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
        </div>

        {/* Date & Time Picker with Available Slots */}
        <FormField
          control={form.control}
          name='serviceDate'
          render={({ fieldState }) => (
            <FormItem>
              <FormLabel>Date & Time *</FormLabel>
              <FormControl>
                <AppointmentSchedulerDialog
                  availableDates={availableDates}
                  slots={slots}
                  isLoadingSlots={isLoadingSlots}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  disabled={
                    !selectedDoctorId || !selectedLocationId || isLoadingDates
                  }
                  allowPast={allowPastDates}
                  onDateSelect={(date) => {
                    form.setValue('serviceDate', date)
                    setSelectedSlot(undefined)
                    form.setValue('timeStart', undefined)
                    form.setValue('timeEnd', undefined)
                  }}
                  onSlotSelect={handleSlotSelect}
                >
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                    disabled={
                      !selectedDoctorId || !selectedLocationId || isLoadingDates
                    }
                    data-invalid={fieldState.invalid}
                  >
                    {selectedDate && selectedSlot
                      ? `${format(selectedDate, 'PPP')} • ${selectedSlot.timeStart} - ${selectedSlot.timeEnd}`
                      : selectedDate
                        ? format(selectedDate, 'PPP')
                        : 'Select date and time'}
                  </Button>
                </AppointmentSchedulerDialog>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
