/**
 * Office Hours Action Dialog
 * Create office hours form dialog
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { doctorService } from '@/api/services'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useActiveWorkLocations } from '@/features/work-locations/data/use-work-locations'
import {
  officeHourFormSchema,
  type OfficeHourFormValues,
  DAYS_OF_WEEK,
} from '../data/schema'
import { useCreateOfficeHour } from '../data/use-office-hours'
import { useOfficeHoursContext } from './office-hours-provider'

// ============================================================================
// Component
// ============================================================================

export function OfficeHoursActionDialog() {
  const { open, setOpen, setCurrentRow } = useOfficeHoursContext()
  const createMutation = useCreateOfficeHour()

  const isOpen = open === 'add'

  // Fetch doctors and work locations for dropdowns
  const { data: workLocations, isLoading: isLoadingLocations } =
    useActiveWorkLocations()
  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    error: doctorsError,
  } = useQuery({
    queryKey: ['doctors', 'active'],
    queryFn: () =>
      doctorService.getDoctors({
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'asc',
      }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const doctors = doctorsData?.data || []
  const isLoadingData = isLoadingDoctors || isLoadingLocations

  // Form setup
  const form = useForm<OfficeHourFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(officeHourFormSchema as any) as any,
    defaultValues: {
      doctorId: null,
      workLocationId: null,
      dayOfWeek: 1, // Default to Monday
      startTime: '08:00',
      endTime: '17:00',
      isGlobal: false,
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        doctorId: null,
        workLocationId: null,
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '17:00',
        isGlobal: false,
      })
    }
  }, [isOpen, form])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }

  // Handle form submission
  const onSubmit = async (values: OfficeHourFormValues) => {
    try {
      // Validate that doctorId exists if provided
      if (values.doctorId && !doctors.find((d) => d.id === values.doctorId)) {
        form.setError('doctorId', {
          type: 'manual',
          message: 'Selected doctor not found. Please select a valid doctor.',
        })
        return
      }

      // Validate that workLocationId exists if provided
      if (
        values.workLocationId &&
        !workLocations?.find((l) => l.id === values.workLocationId)
      ) {
        form.setError('workLocationId', {
          type: 'manual',
          message:
            'Selected location not found. Please select a valid location.',
        })
        return
      }

      // Prepare request data - ensure null values when global
      const requestData = {
        doctorId: values.isGlobal ? null : values.doctorId || null,
        workLocationId: values.isGlobal ? null : values.workLocationId || null,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
        isGlobal: values.isGlobal || false,
      }

      await createMutation.mutateAsync(requestData)

      handleClose()
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending

  // Watch form values to determine office hours type
  const watchedDoctorId = form.watch('doctorId')
  const watchedWorkLocationId = form.watch('workLocationId')
  const watchedIsGlobal = form.watch('isGlobal')

  // Determine office hours type for user feedback
  let officeHoursType = ''
  let officeHoursTypeDescription = ''

  if (watchedIsGlobal) {
    officeHoursType = 'Global Hours'
    officeHoursTypeDescription =
      'These hours apply to all locations as fallback when no specific hours are defined. Lowest priority.'
  } else if (watchedDoctorId && watchedWorkLocationId) {
    officeHoursType = 'Doctor at Specific Location'
    officeHoursTypeDescription =
      'These hours apply to a specific doctor at a specific location. Highest priority.'
  } else if (watchedDoctorId && !watchedWorkLocationId) {
    officeHoursType = 'Doctor (All Locations)'
    officeHoursTypeDescription =
      'These hours apply to a specific doctor across all locations.'
  } else if (!watchedDoctorId && watchedWorkLocationId) {
    officeHoursType = 'Work Location Hours'
    officeHoursTypeDescription =
      'These hours apply to a specific location for all doctors working there.'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Office Hours</DialogTitle>
          <DialogDescription>
            Define working hours for doctors and locations. The system supports
            4 types of office hours with different priority levels.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Office Hours Type Indicator */}
            {officeHoursType && (
              <div className='bg-muted rounded-lg border p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{officeHoursType}</span>
                  <span className='text-muted-foreground text-xs'>
                    {watchedIsGlobal && 'Priority: Lowest'}
                    {!watchedIsGlobal &&
                      !watchedDoctorId &&
                      watchedWorkLocationId &&
                      'Priority: Low'}
                    {!watchedIsGlobal &&
                      watchedDoctorId &&
                      !watchedWorkLocationId &&
                      'Priority: Medium'}
                    {!watchedIsGlobal &&
                      watchedDoctorId &&
                      watchedWorkLocationId &&
                      'Priority: Highest'}
                  </span>
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {officeHoursTypeDescription}
                </p>
              </div>
            )}

            {/* Is Global Checkbox - Moved to top for better UX */}
            <FormField
              control={form.control}
              name='isGlobal'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        // If global is checked, both doctor and location must be null
                        if (checked) {
                          form.setValue('doctorId', null)
                          form.setValue('workLocationId', null)
                        }
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Global Hours</FormLabel>
                    <FormDescription>
                      Apply to all locations as fallback hours. When checked, doctor and location fields will be disabled and cleared.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name='doctorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Doctor{' '}
                    <span className='text-muted-foreground text-xs font-normal'>
                      (Optional)
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === 'none' ? null : value)
                      // If doctor is selected, isGlobal must be false
                      if (value !== 'none') {
                        form.setValue('isGlobal', false)
                      }
                    }}
                    value={field.value || 'none'}
                    disabled={isLoading || form.watch('isGlobal')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a doctor or leave empty' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>
                        <span className='text-muted-foreground'>
                          No specific doctor (for location-wide hours)
                        </span>
                      </SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.fullName}
                          {doctor.specialties &&
                            doctor.specialties.length > 0 && (
                              <span className='text-muted-foreground ml-2 text-xs'>
                                ({doctor.specialties[0].name})
                              </span>
                            )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Leave empty to create location-wide hours for all doctors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Location Selection */}
            <FormField
              control={form.control}
              name='workLocationId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Work Location{' '}
                    <span className='text-muted-foreground text-xs font-normal'>
                      (Optional)
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === 'none' ? null : value)
                      // If location is selected, isGlobal must be false  
                      if (value !== 'none') {
                        form.setValue('isGlobal', false)
                      }
                    }}
                    value={field.value || 'none'}
                    disabled={isLoading || form.watch('isGlobal')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a location or leave empty' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>
                        <span className='text-muted-foreground'>
                          All locations (doctor's default hours)
                        </span>
                      </SelectItem>
                      {workLocations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Leave empty for doctor's hours across all locations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Day of Week */}
            <FormField
              control={form.control}
              name='dayOfWeek'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Day of Week <span className='text-destructive'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a day' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={String(day.value)}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Range */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Time <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        {...field}
                        disabled={isLoading}
                        className='font-mono'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Time <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        {...field}
                        disabled={isLoading}
                        className='font-mono'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isLoading || isLoadingData || doctorsError !== null}
              >
                {(isLoading || isLoadingData) && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                {isLoadingData ? 'Loading...' : 'Create Office Hours'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
