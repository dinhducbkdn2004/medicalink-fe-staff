import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import { useForm, type SubmitHandler } from 'react-hook-form'
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
import { useAuth } from '@/hooks/use-auth'
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
  const { user } = useAuth()
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(
    undefined
  )

  const { mutate: createAppointment, isPending } = useCreateAppointment()

  const form = useForm<TCreateAppointmentFormData>({
    // @ts-expect-error - Zod v4 type compatibility issue with zodResolver
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formControl = form.control as any

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

  const doctorOptions = useMemo(() => {
    let filteredDoctors = doctors

    // If current user is a doctor, only show themselves
    if (user?.role === 'DOCTOR') {
      filteredDoctors = doctors.filter((doc) => doc.staffAccountId === user.id)
    }

    return filteredDoctors.map((doctor) => ({
      value: doctor.id, // Use profile ID for slots and appointment creation
      label: doctor.fullName,
    }))
  }, [doctors, user])

  // Auto-select doctor if only one option (especially for DOCTOR role)
  useEffect(() => {
    if (
      user?.role === 'DOCTOR' &&
      doctorOptions.length === 1 &&
      selectedDoctorId !== doctorOptions[0].value
    ) {
      form.setValue('doctorId', doctorOptions[0].value)
    }
  }, [user, doctorOptions, selectedDoctorId, form])

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

  const onSubmit: SubmitHandler<TCreateAppointmentFormData> = useCallback(
    (values) => {
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

      <DialogContent className='max-h-[85vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment by selecting patient, location, specialty,
            doctor, and time slot.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='appointment-form'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={form.handleSubmit(onSubmit as any)}
            className='grid gap-3 py-3'
          >
            {/* Step 0: Patient Selection */}
            <FormField
              control={formControl}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 1 & 2: Location and Specialty in 2 columns */}
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={formControl}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formControl}
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
                        <SelectTrigger
                          data-invalid={fieldState.invalid}
                          className='w-full truncate'
                        >
                          <SelectValue
                            placeholder={getSpecialtyPlaceholder()}
                            className='truncate'
                          />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 3: Doctor Selection (Requires BOTH Location AND Specialty) */}
            <FormField
              control={formControl}
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
                        isLoadingDoctors ||
                        (user?.role === 'DOCTOR' && doctorOptions.length > 0)
                      }
                    >
                      <SelectTrigger
                        data-invalid={fieldState.invalid}
                        className='w-full truncate'
                      >
                        <SelectValue
                          placeholder={getDoctorPlaceholder()}
                          className='truncate'
                        />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 4 & 5: Date and Time Selection via Scheduler Dialog */}
            <div className='space-y-1'>
              <FormLabel>Date & Time *</FormLabel>
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
            </div>

            {/* Step 6: Reason, Notes, and Price */}
            <FormField
              control={formControl}
              name='reason'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='reason'>Reason *</FormLabel>
                  <FormControl>
                    <Input
                      id='reason'
                      placeholder='Reason for appointment'
                      maxLength={255}
                      data-invalid={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formControl}
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
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-start gap-2'>
              <FormField
                control={formControl}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formControl}
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
