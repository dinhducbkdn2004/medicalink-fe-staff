import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  usePatients,
  useWorkLocations,
  useSpecialties,
  useDoctorsByLocationAndSpecialty,
  useDoctorAvailableDates,
  useAvailableSlots,
} from '@/calendar/hooks/use-appointment-form-data'
import {
  createAppointmentSchema,
  type TCreateAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeSlot } from '@/api/services/doctor-profile.service'
import type { CreateAppointmentRequest } from '@/api/types/appointment.types'
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SearchableSelect } from '@/components/ui/searchable-select'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateAppointment } from '@/features/appointments/data/hooks'
import { AppointmentSchedulerDialog } from './appointment-scheduler-dialog'

interface IProps {
  readonly children: React.ReactNode
  readonly startDate?: Date
  readonly startTime?: { hour: number; minute: number }
}

export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(
    undefined
  )

  const { mutate: createAppointment, isPending } = useCreateAppointment()

  const form = useForm<TCreateAppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      patientId: '',
      locationId: '',
      specialtyId: '',
      doctorId: '',
      serviceDate: startDate ?? undefined,
      timeStart: startTime ?? undefined,
      reason: '',
      notes: '',
      currency: 'VND',
    },
  })

  // Watch form values for dependent selects
  const selectedLocationId = form.watch('locationId')
  const selectedSpecialtyId = form.watch('specialtyId')
  const selectedDoctorId = form.watch('doctorId')
  const selectedServiceDate = form.watch('serviceDate')

  // Track previous values to detect actual changes
  const prevLocationRef = useRef<string | undefined>(undefined)
  const prevSpecialtyRef = useRef<string | undefined>(undefined)
  const prevDoctorRef = useRef<string | undefined>(undefined)

  // Fetch data (location and specialty are independent)
  const { patients, isLoading: isLoadingPatients } = usePatients(patientSearch)
  const { locations, isLoading: isLoadingLocations } = useWorkLocations()
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties()

  // Only fetch doctors when BOTH location AND specialty are selected
  const { doctors, isLoading: isLoadingDoctors } =
    useDoctorsByLocationAndSpecialty(selectedLocationId, selectedSpecialtyId)

  // Fetch available dates when doctor and location are selected
  const { availableDates, isLoading: isLoadingDates } = useDoctorAvailableDates(
    selectedDoctorId,
    selectedLocationId
  )

  // Only fetch slots when doctor, location, and date are all selected
  const { slots, isLoading: isLoadingSlots } = useAvailableSlots(
    selectedDoctorId,
    selectedLocationId,
    selectedServiceDate
  )

  // Reset dependent fields only when VALUES ACTUALLY CHANGE
  useEffect(() => {
    const locationChanged =
      prevLocationRef.current !== undefined &&
      prevLocationRef.current !== selectedLocationId
    const specialtyChanged =
      prevSpecialtyRef.current !== undefined &&
      prevSpecialtyRef.current !== selectedSpecialtyId

    if (locationChanged || specialtyChanged) {
      // Reset doctor and times when location or specialty changes
      form.setValue('doctorId', '')
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeStart', undefined)
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeEnd', undefined)
    }

    // Update refs
    prevLocationRef.current = selectedLocationId
    prevSpecialtyRef.current = selectedSpecialtyId
  }, [selectedLocationId, selectedSpecialtyId, form])

  useEffect(() => {
    const doctorChanged =
      prevDoctorRef.current !== undefined &&
      prevDoctorRef.current !== selectedDoctorId

    if (doctorChanged) {
      // Reset date and slot when doctor changes
      // @ts-expect-error - allow undefined for date reset
      form.setValue('serviceDate', undefined)
      setSelectedSlot(undefined)
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeStart', undefined)
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeEnd', undefined)
    }

    // Update ref
    prevDoctorRef.current = selectedDoctorId
  }, [selectedDoctorId, form])

  // Memoized placeholder functions
  const getSpecialtyPlaceholder = useCallback(() => {
    if (isLoadingSpecialties) return 'Loading...'
    return 'Select a specialty'
  }, [isLoadingSpecialties])

  const getDoctorPlaceholder = useCallback(() => {
    if (!selectedLocationId || !selectedSpecialtyId) {
      return 'Select location and specialty first'
    }
    if (isLoadingDoctors) return 'Loading...'
    if (doctors.length === 0) return 'No doctors available'
    return 'Select a doctor'
  }, [
    selectedLocationId,
    selectedSpecialtyId,
    isLoadingDoctors,
    doctors.length,
  ])

  // Memoized options for better performance
  const patientOptions = useMemo(
    () =>
      patients.map((patient) => ({
        value: patient.id,
        label: patient.fullName || 'Unknown',
        subtitle: patient.email || patient.phone || undefined,
      })),
    [patients]
  )

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        value: location.id,
        label: location.name,
      })),
    [locations]
  )

  const specialtyOptions = useMemo(
    () =>
      specialties.map((specialty) => ({
        value: specialty.id,
        label: specialty.name,
      })),
    [specialties]
  )

  const doctorOptions = useMemo(
    () =>
      doctors.map((doctor) => ({
        value: doctor.id, // Use profile ID for slots and appointment creation
        label: doctor.fullName,
      })),
    [doctors]
  )

  // Memoized button text for scheduler dialog
  const schedulerButtonText = useMemo(() => {
    if (isLoadingDates) return 'Loading appointment dates...'
    if (selectedServiceDate && selectedSlot) {
      return `${format(selectedServiceDate, 'dd/MM/yyyy')} • ${selectedSlot.timeStart}-${selectedSlot.timeEnd}`
    }
    if (selectedServiceDate) {
      return `${format(selectedServiceDate, 'dd/MM/yyyy')} • Select time slot`
    }
    return 'Select date & time slot'
  }, [isLoadingDates, selectedServiceDate, selectedSlot])

  // Memoized description for scheduler
  const schedulerDescription = useMemo(() => {
    if (!selectedDoctorId || !selectedLocationId) {
      return 'Please select a doctor first'
    }
    if (isLoadingDates) {
      return 'Loading appointment dates...'
    }
    if (availableDates.length > 0) {
      return `${availableDates.length} available appointment dates`
    }
    return 'No available appointment dates'
  }, [
    selectedDoctorId,
    selectedLocationId,
    isLoadingDates,
    availableDates.length,
  ])

  const onSubmit = useCallback(
    (values: TCreateAppointmentFormData) => {
      const requestData: CreateAppointmentRequest = {
        ...values,
        serviceDate: format(values.serviceDate, 'yyyy-MM-dd'),
        timeStart: `${String(values.timeStart.hour).padStart(2, '0')}:${String(values.timeStart.minute).padStart(2, '0')}`,
        timeEnd: `${String(values.timeEnd.hour).padStart(2, '0')}:${String(values.timeEnd.minute).padStart(2, '0')}`,
      }

      createAppointment(requestData, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
    },
    [createAppointment, onClose, form]
  )

  useEffect(() => {
    if (isOpen) {
      setSelectedSlot(undefined)
      form.reset({
        serviceDate: startDate,
        timeStart: startTime,
        patientId: '',
        locationId: '',
        specialtyId: '',
        doctorId: '',
        reason: '',
        notes: '',
        currency: 'VND',
      })
    }
  }, [startDate, startTime, form, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new appointment. Location and
            Specialty are independent. Doctors will be filtered by both Location
            AND Specialty.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='appointment-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-4 py-4'
          >
            {/* Step 0: Patient Selection */}
            <FormField
              control={form.control}
              name='patientId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Patient *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      onSearchChange={setPatientSearch}
                      options={patientOptions}
                      placeholder='Search patient by name, email or phone...'
                      emptyMessage='No patient found'
                      isLoading={isLoadingPatients}
                      className={fieldState.invalid ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Search and select a patient for this appointment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 1: Location Selection (Independent from Specialty) */}
            <FormField
              control={form.control}
              name='locationId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingLocations}
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
                        {locationOptions.map((location) => (
                          <SelectItem
                            key={location.value}
                            value={location.value}
                          >
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select work location (independent selection)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 2: Specialty Selection (Independent from Location) */}
            <FormField
              control={form.control}
              name='specialtyId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Specialty *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingSpecialties}
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder={getSpecialtyPlaceholder()} />
                      </SelectTrigger>
                      <SelectContent>
                        {specialtyOptions.map((specialty) => (
                          <SelectItem
                            key={specialty.value}
                            value={specialty.value}
                          >
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a specialty (independent selection)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 3: Doctor Selection (Requires BOTH Location AND Specialty) */}
            <FormField
              control={form.control}
              name='doctorId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Doctor *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        !selectedLocationId ||
                        !selectedSpecialtyId ||
                        isLoadingDoctors
                      }
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder={getDoctorPlaceholder()} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctorOptions.map((doctor) => (
                          <SelectItem key={doctor.value} value={doctor.value}>
                            {doctor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Doctors available at selected location with selected
                    specialty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 4 & 5: Date and Time Selection via Scheduler Dialog */}
            <div className='space-y-2'>
              <FormLabel>Select date & time slot *</FormLabel>
              <AppointmentSchedulerDialog
                availableDates={availableDates}
                slots={slots}
                isLoadingSlots={isLoadingSlots}
                selectedDate={selectedServiceDate}
                selectedSlot={selectedSlot}
                disabled={
                  !selectedDoctorId || !selectedLocationId || isLoadingDates
                }
                onDateSelect={(date) => {
                  form.setValue('serviceDate', date)
                  setSelectedSlot(undefined)
                  // Reset time when date changes
                  // @ts-expect-error - allow undefined for time reset
                  form.setValue('timeStart', undefined)
                  // @ts-expect-error - allow undefined for time reset
                  form.setValue('timeEnd', undefined)
                }}
                onSlotSelect={(slot) => {
                  setSelectedSlot(slot)
                  const [startHour, startMinute] = slot.timeStart
                    .split(':')
                    .map(Number)
                  const [endHour, endMinute] = slot.timeEnd
                    .split(':')
                    .map(Number)
                  form.setValue('timeStart', {
                    hour: startHour,
                    minute: startMinute,
                  })
                  form.setValue('timeEnd', {
                    hour: endHour,
                    minute: endMinute,
                  })
                }}
              >
                <Button
                  type='button'
                  variant='outline'
                  className='w-full justify-start text-left font-normal'
                  disabled={
                    !selectedDoctorId || !selectedLocationId || isLoadingDates
                  }
                >
                  {schedulerButtonText}
                </Button>
              </AppointmentSchedulerDialog>
              <FormDescription>{schedulerDescription}</FormDescription>
            </div>

            {/* Step 6: Reason, Notes, and Price */}
            <FormField
              control={form.control}
              name='reason'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='reason'>Reason</FormLabel>
                  <FormControl>
                    <Input
                      id='reason'
                      placeholder='Reason for appointment (max 255 characters)'
                      maxLength={255}
                      data-invalid={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional, max 255 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder='Additional notes'
                      data-invalid={fieldState.invalid}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional additional information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-start gap-2'>
              <FormField
                control={form.control}
                name='priceAmount'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0.00'
                        data-invalid={fieldState.invalid}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='currency'
                render={({ field, fieldState }) => (
                  <FormItem className='w-32'>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger data-invalid={fieldState.invalid}>
                          <SelectValue placeholder='VND' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='VND'>VND</SelectItem>
                          <SelectItem value='USD'>USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button form='appointment-form' type='submit' disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
