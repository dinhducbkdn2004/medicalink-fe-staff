import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useSpecialties,
  useDoctorsBySpecialty,
  useLocationsByDoctor,
  usePatients,
} from '@/calendar/hooks/use-appointment-form-data'
import {
  createAppointmentSchema,
  type TCreateAppointmentFormData,
} from '@/calendar/schemas'
import type { TimeValue } from 'react-aria-components'
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
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { Textarea } from '@/components/ui/textarea'
import { TimeInput } from '@/components/ui/time-input'
import { useCreateAppointment } from '@/features/appointments/data/hooks'

interface IProps {
  children: React.ReactNode
  startDate?: Date
  startTime?: { hour: number; minute: number }
}

export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [patientSearch, setPatientSearch] = useState('')

  const { mutate: createAppointment, isPending } = useCreateAppointment()

  const form = useForm<TCreateAppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      specialtyId: '',
      patientId: '',
      doctorId: '',
      locationId: '',
      serviceDate: startDate ?? undefined,
      timeStart: startTime ?? undefined,
      reason: '',
      notes: '',
      status: 'BOOKED',
      currency: 'VND',
    },
  })

  // Watch form values for dependent selects
  const selectedSpecialtyId = form.watch('specialtyId')
  const selectedDoctorId = form.watch('doctorId')

  // Fetch data based on selections
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties()
  const { doctors, isLoading: isLoadingDoctors } =
    useDoctorsBySpecialty(selectedSpecialtyId)
  const { locations, isLoading: isLoadingLocations } =
    useLocationsByDoctor(selectedDoctorId)
  const { patients, isLoading: isLoadingPatients } = usePatients(patientSearch)

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (selectedSpecialtyId) {
      form.setValue('doctorId', '')
      form.setValue('locationId', '')
    }
  }, [selectedSpecialtyId, form])

  useEffect(() => {
    if (selectedDoctorId) {
      form.setValue('locationId', '')
    }
  }, [selectedDoctorId, form])

  // Helper functions for placeholder text
  const getDoctorPlaceholder = () => {
    if (!selectedSpecialtyId) return 'Select a specialty first'
    if (isLoadingDoctors) return 'Loading...'
    return 'Select a doctor'
  }

  const getLocationPlaceholder = () => {
    if (!selectedDoctorId) return 'Select a doctor first'
    if (isLoadingLocations) return 'Loading...'
    return 'Select a location'
  }

  const onSubmit = (values: TCreateAppointmentFormData) => {
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
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        serviceDate: startDate,
        timeStart: startTime,
        specialtyId: '',
        patientId: '',
        doctorId: '',
        locationId: '',
        reason: '',
        notes: '',
        status: 'BOOKED',
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
            Fill in the details to create a new appointment for the patient.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='appointment-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-4 py-4'
          >
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
                      options={
                        patients?.map((patient) => ({
                          value: patient.id,
                          label: patient.fullName || 'Unknown',
                          subtitle: patient.email || patient.phone || undefined,
                        })) || []
                      }
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

            <FormField
              control={form.control}
              name='specialtyId'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Specialty *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        data-invalid={fieldState.invalid}
                        disabled={isLoadingSpecialties}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingSpecialties
                              ? 'Loading...'
                              : 'Select a specialty'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties?.map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.id}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a specialty (this will load available doctors)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={!selectedSpecialtyId || isLoadingDoctors}
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder={getDoctorPlaceholder()} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.fullName || 'Unknown Doctor'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Available doctors for selected specialty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={!selectedDoctorId || isLoadingLocations}
                    >
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder={getLocationPlaceholder()} />
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
                  <FormDescription>
                    Available locations for selected doctor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='serviceDate'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='serviceDate'>Service Date *</FormLabel>
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
                    <FormLabel>Start Time *</FormLabel>
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
                    <FormLabel>End Time *</FormLabel>
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
              name='reason'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='reason'>Reason</FormLabel>
                  <FormControl>
                    <Input
                      id='reason'
                      placeholder='Reason for appointment'
                      data-invalid={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='BOOKED'>Booked</SelectItem>
                        <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
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
