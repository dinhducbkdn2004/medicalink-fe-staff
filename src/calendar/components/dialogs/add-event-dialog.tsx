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
  usePublicDoctors,
} from '@/calendar/hooks/use-appointment-form-data'
import {
  createAppointmentSchema,
  type TCreateAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeSlot } from '@/api/services/doctor-profile.service'
import type { CreateAppointmentRequest } from '@/api/types/appointment.types'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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
import { useCreateAppointment } from '@/features/appointments/data/hooks'
import { RichTextEditor } from '@/features/doctors/components/rich-text-editor'
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

  // Get user role to determine if past dates can be selected
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const allowPastDates = user
    ? user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
    : false

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

  // Fetch data
  const { patients, isLoading: isLoadingPatients } = usePatients(patientSearch)
  const { locations, isLoading: isLoadingLocations } = useWorkLocations()
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties()

  // 1. Fetch ALL public doctors for initial selection (when no filters)
  const { doctors: allDoctors, isLoading: isLoadingAllDoctors } =
    usePublicDoctors()

  // 2. Fetch FILTERED doctors when filters are active
  const { doctors: filteredDoctors, isLoading: isLoadingFilteredDoctors } =
    useDoctorsByLocationAndSpecialty(selectedLocationId, selectedSpecialtyId)

  // Determine which doctors list to show
  // Show filtered list only if BOTH location and specialty are selected
  // Otherwise show all doctors (to allow "Select Doctor First")
  const showFilteredDoctors = selectedLocationId && selectedSpecialtyId
  const displayDoctors = showFilteredDoctors ? filteredDoctors : allDoctors
  const isLoadingDoctors = showFilteredDoctors
    ? isLoadingFilteredDoctors
    : isLoadingAllDoctors

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
      // If filters change, we might need to reset doctor
      // BUT if we just auto-filled them from a doctor selection, we shouldn't reset.
      // We can check if the current doctor is still valid for the new filters?
      // For now, keep the reset behavior implies "filtering down".
      // Note: If user selects doctor first -> location/specialty filled.
      // If user then changes location -> doctor might need reset if not in new location.
      // For simplicity, reset doctor if filters change manually.
      // To distinguish manual change vs auto-fill:
      // When auto-fill happens, we set location, specialty AND doctor roughly same time.
      // But standard interaction is: user picks doctor -> we set loc/spec.
      // If user picks loc/spec -> we reset doctor.
      // We verify validity in the doctorOptions logic? No.
      if (selectedDoctorId) {
        // If doctor is selected, checks if he is still in the new filtered list?
        // It's complex to check validity async.
        // Let's rely on the user to re-select if needed, OR
        // If the change was triggered by "Select Doctor First", we don't want to reset immediately.
        // But here we are detecting change in location/specialty.
        // If I select doctor, I update location/specialty. This effect runs.
        // It sees change. It resets doctor. BAD.
        // Fix: Don't reset doctor if the location/specialty matches the current doctor's work places?
        // Or simply: check if we are in "auto-filling" state? No easy way.
        // Better: Check if the currently selected doctor supports the new location/specialty.
        // But we don't have the full doctor object here easily unless we find it in allDoctors.

        // Let's find the doctor in allDoctors (or displayDoctors)
        const currentDoc =
          displayDoctors.find((d) => d.id === selectedDoctorId) ||
          allDoctors.find((d) => d.id === selectedDoctorId)

        if (currentDoc) {
          const hasLocation =
            !selectedLocationId ||
            currentDoc.workLocations.some((l) => l.id === selectedLocationId)
          const hasSpecialty =
            !selectedSpecialtyId ||
            currentDoc.specialties.some((s) => s.id === selectedSpecialtyId)

          if (hasLocation && hasSpecialty) {
            // Doctor is still valid, don't reset
            prevLocationRef.current = selectedLocationId
            prevSpecialtyRef.current = selectedSpecialtyId
            return
          }
        }
      }

      form.setValue('doctorId', '')
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeStart', undefined)
      // @ts-expect-error - allow undefined for time reset
      form.setValue('timeEnd', undefined)
    }

    // Update refs
    prevLocationRef.current = selectedLocationId
    prevSpecialtyRef.current = selectedSpecialtyId
  }, [
    selectedLocationId,
    selectedSpecialtyId,
    form,
    selectedDoctorId,
    displayDoctors,
    allDoctors,
  ]) // Added deps

  useEffect(() => {
    const doctorChanged =
      prevDoctorRef.current !== undefined &&
      prevDoctorRef.current !== selectedDoctorId

    if (doctorChanged) {
      // AUTO-FILL LOGIC: If doctor selected, and location/specialty missing, fill them.
      if (selectedDoctorId) {
        const doctor =
          allDoctors.find((d) => d.id === selectedDoctorId) ||
          filteredDoctors.find((d) => d.id === selectedDoctorId)

        if (doctor) {
          // Fill Location if undefined or empty
          if (!selectedLocationId && doctor.workLocations.length > 0) {
            form.setValue('locationId', doctor.workLocations[0].id)
          }
          // Fill Specialty if undefined or empty
          if (!selectedSpecialtyId && doctor.specialties.length > 0) {
            form.setValue('specialtyId', doctor.specialties[0].id)
          }
        }
      }

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
  }, [
    selectedDoctorId,
    form,
    allDoctors,
    filteredDoctors,
    selectedLocationId,
    selectedSpecialtyId,
  ])

  // Memoized placeholder functions
  const getSpecialtyPlaceholder = useCallback(() => {
    if (isLoadingSpecialties) return 'Loading...'
    return 'Select a specialty'
  }, [isLoadingSpecialties])

  const getDoctorPlaceholder = useCallback(() => {
    if (isLoadingDoctors) return 'Loading...'
    if (displayDoctors.length === 0) return 'No doctors available'
    return 'Select a doctor'
  }, [isLoadingDoctors, displayDoctors.length])

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
    return displayDoctors.map((doctor) => ({
      value: doctor.id, // Use profile ID for slots and appointment creation
      label: doctor.fullName,
    }))
  }, [displayDoctors])

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

  // Reset form when dialog opens
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

      <DialogContent className='max-h-[95vh] w-[90vw] max-w-6xl min-w-[800px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment. You can select a doctor directly to
            auto-fill location and specialty.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='appointment-form'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={form.handleSubmit(onSubmit as any)}
            className='grid gap-6 py-4'
          >
            {/* Step 0: Patient Selection */}
            <FormField
              control={formControl}
              name='patientId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Patient <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      onSearchChange={setPatientSearch}
                      options={patientOptions}
                      placeholder='Search patient by name, email or phone...'
                      emptyMessage='No patient found'
                      isLoading={isLoadingPatients}
                      className={`w-full ${
                        fieldState.invalid
                          ? 'border-destructive focus-visible:border-destructive'
                          : ''
                      } ${field.value ? 'h-12' : ''}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Step 1 & 2: Location and Specialty in 2 columns */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={formControl}
                name='locationId'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Location <span className='text-red-500'>*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Specialty <span className='text-red-500'>*</span>
                    </FormLabel>
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

            {/* Step 3: Doctor Selection (Auto-enabled) */}
            <FormField
              control={formControl}
              name='doctorId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Doctor <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingDoctors}
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
              <FormLabel>
                Date & Time <span className='text-red-500'>*</span>
              </FormLabel>
              <AppointmentSchedulerDialog
                availableDates={availableDates}
                slots={slots}
                isLoadingSlots={isLoadingSlots}
                selectedDate={selectedServiceDate}
                selectedSlot={selectedSlot}
                disabled={
                  !selectedDoctorId || !selectedLocationId || isLoadingDates
                }
                allowPast={allowPastDates} // Only ADMIN/SUPER_ADMIN can select past dates
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

            {/* Step 6: Reason */}
            <FormField
              control={formControl}
              name='reason'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='reason'>
                    Reason <span className='text-red-500'>*</span>
                  </FormLabel>
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

            {/* Price */}
            <FormField
              control={formControl}
              name='priceAmount'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Price (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='0.00'
                      data-invalid={fieldState.invalid}
                      {...field}
                      value={field.value || ''}
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

            {/* Notes - full width */}
            <FormField
              control={formControl}
              name='notes'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Additional notes for the appointment'
                      accessToken={accessToken || ''}
                      toolbarOptions='minimal'
                      enableImageUpload={true}
                      enableVideoUpload={true}
                      enableSyntax={false}
                      enableFormula={false}
                      size='compact'
                      className={cn(
                        fieldState.invalid &&
                          'border-red-500 focus-within:ring-red-500'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='pt-6'>
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
