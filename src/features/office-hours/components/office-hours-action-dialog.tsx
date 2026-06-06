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
import { MultiSelect } from '@/components/ui/multi-select'
import {
  officeHourFormSchema,
  type OfficeHourFormValues,
  DAYS_OF_WEEK,
} from '../data/schema'
import { useCreateOfficeHour } from '../data/use-office-hours'
import { useOfficeHoursContext } from './office-hours-provider'

export function OfficeHoursActionDialog() {
  const { open, setOpen, setCurrentRow } = useOfficeHoursContext()
  const createMutation = useCreateOfficeHour()

  const isOpen = open === 'add'
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
    staleTime: 1000 * 60 * 10,
  })

  const doctors = doctorsData?.data || []
  const isLoadingData = isLoadingDoctors

  const form = useForm<OfficeHourFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(officeHourFormSchema as any) as any,
    defaultValues: {
      doctorIds: [],
      workLocationId: null,
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '17:00',
      isGlobal: false,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        doctorIds: [],
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

  const onSubmit = async (values: OfficeHourFormValues) => {
    try {
      if (!values.isGlobal && values.doctorIds.length === 0) {
        form.setError('doctorIds', {
          type: 'manual',
          message: 'Please select at least one doctor.',
        })
        return
      }

      if (values.isGlobal) {
        const requestData = {
          doctorId: null,
          workLocationId: null,
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
          isGlobal: true,
        }
        await createMutation.mutateAsync(requestData)
      } else {
        await Promise.allSettled(
          values.doctorIds.map(async (doctorId) => {
            const requestData = {
              doctorId,
              workLocationId: null,
              dayOfWeek: values.dayOfWeek,
              startTime: values.startTime,
              endTime: values.endTime,
              isGlobal: false,
            }
            return createMutation.mutateAsync(requestData)
          })
        )
      }

      handleClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending

  const watchedIsGlobal = form.watch('isGlobal')

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
            {}
            {}

            {}
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

                        if (checked) {
                          form.setValue('doctorIds', [])
                        }
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Clinic Hours (Applies to all doctors)</FormLabel>
                    <FormDescription>
                      Apply to the entire clinic as global fallback hours. When checked,
                      doctor selection will be disabled and cleared.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {}
            <FormField
              control={form.control}
              name='doctorIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Doctor{' '}
                    <span className='text-muted-foreground text-xs font-normal'>
                      (Optional)
                    </span>
                  </FormLabel>
                  <MultiSelect
                    options={doctors.map((d) => ({
                      value: d.id,
                      label: `Dr. ${d.fullName}`,
                      subtitle: d.specialties?.[0]?.name,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                    disabled={isLoading || watchedIsGlobal}
                    placeholder='Select one or more doctors...'
                    searchPlaceholder='Search doctor...'
                  />
                  <FormDescription>
                    Select one or multiple doctors to create shifts in batch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            {/* Work Location field removed for Single-Location */}

            {}
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

            {}
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
