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

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const allowPastDates = user
    ? user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
    : false

  const { mutate: createAppointment, isPending } = useCreateAppointment()

  const form = useForm<TCreateAppointmentFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAppointmentSchema) as any,
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

  const selectedLocationId = form.watch('locationId')
  const selectedSpecialtyId = form.watch('specialtyId')
  const selectedDoctorId = form.watch('doctorId')
  const selectedServiceDate = form.watch('serviceDate')

  const prevLocationRef = useRef<string | undefined>(undefined)
  const prevSpecialtyRef = useRef<string | undefined>(undefined)
  const prevDoctorRef = useRef<string | undefined>(undefined)

  const { patients, isLoading: isLoadingPatients } = usePatients(patientSearch)
  const { locations, isLoading: isLoadingLocations } = useWorkLocations()
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties()

  const { doctors: allDoctors, isLoading: isLoadingAllDoctors } =
    usePublicDoctors()

  const { doctors: filteredDoctors, isLoading: isLoadingFilteredDoctors } =
    useDoctorsByLocationAndSpecialty(selectedLocationId, selectedSpecialtyId)
  const showFilteredDoctors = selectedLocationId && selectedSpecialtyId
  const displayDoctors = showFilteredDoctors ? filteredDoctors : allDoctors
  const isLoadingDoctors = showFilteredDoctors
    ? isLoadingFilteredDoctors
    : isLoadingAllDoctors

  const { availableDates, isLoading: isLoadingDates } = useDoctorAvailableDates(
    selectedDoctorId,
    selectedLocationId
  )

  const { slots, isLoading: isLoadingSlots } = useAvailableSlots(
    selectedDoctorId,
    selectedLocationId,
    selectedServiceDate
  )

  useEffect(() => {
    const locationChanged =
      prevLocationRef.current !== undefined &&
      prevLocationRef.current !== selectedLocationId
    const specialtyChanged =
      prevSpecialtyRef.current !== undefined &&
      prevSpecialtyRef.current !== selectedSpecialtyId

    if (locationChanged || specialtyChanged) {
      if (selectedDoctorId) {
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
            prevLocationRef.current = selectedLocationId
            prevSpecialtyRef.current = selectedSpecialtyId
            return
          }
        }
      }

      form.setValue('doctorId', '')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('timeStart', undefined as any)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('timeEnd', undefined as any)
    }

    prevLocationRef.current = selectedLocationId
    prevSpecialtyRef.current = selectedSpecialtyId
  }, [
    selectedLocationId,
    selectedSpecialtyId,
    form,
    selectedDoctorId,
    displayDoctors,
    allDoctors,
  ])

  useEffect(() => {
    const doctorChanged =
      prevDoctorRef.current !== undefined &&
      prevDoctorRef.current !== selectedDoctorId

    if (doctorChanged) {
      if (selectedDoctorId) {
        const doctor =
          allDoctors.find((d) => d.id === selectedDoctorId) ||
          filteredDoctors.find((d) => d.id === selectedDoctorId)

        if (doctor) {
          if (!selectedLocationId && doctor.workLocations.length > 0) {
            form.setValue('locationId', doctor.workLocations[0].id)
          }

          if (!selectedSpecialtyId && doctor.specialties.length > 0) {
            form.setValue('specialtyId', doctor.specialties[0].id)
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('serviceDate', undefined as any)
      setSelectedSlot(undefined)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('timeStart', undefined as any)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('timeEnd', undefined as any)
    }

    prevDoctorRef.current = selectedDoctorId
  }, [
    selectedDoctorId,
    form,
    allDoctors,
    filteredDoctors,
    selectedLocationId,
    selectedSpecialtyId,
  ])

  const getSpecialtyPlaceholder = useCallback(() => {
    if (isLoadingSpecialties) return 'Loading...'
    return 'Select a specialty'
  }, [isLoadingSpecialties])

  const getDoctorPlaceholder = useCallback(() => {
    if (isLoadingDoctors) return 'Loading...'
    if (displayDoctors.length === 0) return 'No doctors available'
    return 'Select a doctor'
  }, [isLoadingDoctors, displayDoctors.length])

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
      value: doctor.id,
      label: doctor.fullName,
    }))
  }, [displayDoctors])

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

      <DialogContent className='max-h-[95vh] w-[95vw] max-w-6xl overflow-y-auto sm:min-w-[600px] md:min-w-[700px] lg:min-w-[800px]'>
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
            {}
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

            {}
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

            {}
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

            {}
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
                allowPast={allowPastDates}
                onDateSelect={(date) => {
                  form.setValue('serviceDate', date)
                  setSelectedSlot(undefined)

                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  form.setValue('timeStart', undefined as any)

                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  form.setValue('timeEnd', undefined as any)
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

            {}
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

            {}
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

            {}
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
