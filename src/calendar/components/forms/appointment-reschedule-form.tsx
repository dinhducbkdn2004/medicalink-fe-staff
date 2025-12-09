import { useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import {
  doctorProfileService,
  type TimeSlot,
} from '@/api/services/doctor-profile.service'
import type { RescheduleAppointmentRequest } from '@/api/types/appointment.types'
import { cn } from '@/lib/utils'
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
import { SingleDayPicker } from '@/components/ui/single-day-picker'
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

  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

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
    },
  })

  // Watch values for fetching slots
  const selectedDoctorId = form.watch('doctorId')
  const selectedLocationId = form.watch('locationId')
  const selectedDate = form.watch('serviceDate')

  // Watch time for highlighting selected slot
  const selectedTimeStart = form.watch('timeStart')
  const selectedTimeEnd = form.watch('timeEnd')

  // Fetch doctors based on appointment specialty
  const { doctors, isLoading: isLoadingDoctors } = useDoctorsBySpecialty(
    appointment?.specialtyId
  )

  // Fetch locations based on selected doctor
  const { locations, isLoading: isLoadingLocations } =
    useLocationsByDoctor(selectedDoctorId)

  // Reset location if doctor changes
  useEffect(() => {
    if (
      selectedDoctorId !== appointment.doctorId &&
      form.getValues('locationId')
    ) {
      form.setValue('locationId', '')
    }
  }, [selectedDoctorId, appointment.doctorId, form])

  // Fetch available slots
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDoctorId || !selectedLocationId || !selectedDate) {
        setSlots([])
        return
      }

      setLoadingSlots(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const fetchedSlots = await doctorProfileService.getDoctorAvailableSlots(
          selectedDoctorId,
          selectedLocationId,
          dateStr,
          true // allowPast? Maybe check if it's today
        )
        setSlots(fetchedSlots)
      } catch (error) {
        console.error('Failed to fetch slots', error)
        setSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDoctorId, selectedLocationId, selectedDate])

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

  const handleSlotClick = (slot: TimeSlot) => {
    const [startHour, startMinute] = slot.timeStart.split(':').map(Number)
    const [endHour, endMinute] = slot.timeEnd.split(':').map(Number)

    form.setValue('timeStart', { hour: startHour, minute: startMinute })
    form.setValue('timeEnd', { hour: endHour, minute: endMinute })
    form.trigger(['timeStart', 'timeEnd'])
  }

  // Format form time to string for comparison
  const currentTimeStartStr = selectedTimeStart
    ? `${String(selectedTimeStart.hour).padStart(2, '0')}:${String(selectedTimeStart.minute).padStart(2, '0')}`
    : ''
  const currentTimeEndStr = selectedTimeEnd
    ? `${String(selectedTimeEnd.hour).padStart(2, '0')}:${String(selectedTimeEnd.minute).padStart(2, '0')}`
    : ''

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

        {/* Available Slots Section */}
        <div className='space-y-2'>
          <FormLabel>Available Slots</FormLabel>
          <div className='rounded-md border p-4'>
            {loadingSlots ? (
              <div className='text-muted-foreground flex items-center justify-center py-4 text-sm'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading available slots...
              </div>
            ) : !selectedDate || !selectedDoctorId || !selectedLocationId ? (
              <div className='text-muted-foreground py-4 text-center text-sm'>
                Select doctor, location and date to view available slots
              </div>
            ) : slots.length === 0 ? (
              <div className='text-muted-foreground py-4 text-center text-sm'>
                No available slots for this date
              </div>
            ) : (
              <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                {slots.map((slot, index) => {
                  const isSelected =
                    currentTimeStartStr === slot.timeStart &&
                    currentTimeEndStr === slot.timeEnd

                  return (
                    <Button
                      key={`${slot.timeStart}-${index}`}
                      type='button'
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'flex h-auto flex-col items-center px-3 py-2 text-xs',
                        isSelected && 'border-primary'
                      )}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <span className='font-medium'>{slot.timeStart}</span>
                      <span className='text-[10px] opacity-70'>
                        to {slot.timeEnd}
                      </span>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
          {/* Hidden fields to maintain validation logic if needed, or just rely on state */}
          <FormMessage>{form.formState.errors.timeStart?.message}</FormMessage>
        </div>

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
