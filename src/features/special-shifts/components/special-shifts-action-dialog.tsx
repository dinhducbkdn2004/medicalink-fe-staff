import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { doctorService } from '@/api/services'
import { Button } from '@/components/ui/button'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  specialShiftFormSchema,
  type SpecialShiftFormValues,
} from '../data/schema'
import { useCreateSpecialShift } from '../data/use-special-shifts'
import { useSpecialShiftsContext } from './special-shifts-provider'

export function SpecialShiftsActionDialog({
  defaultDoctorId,
}: {
  defaultDoctorId?: string
}) {
  const { open, setOpen, setCurrentRow } = useSpecialShiftsContext()
  const createMutation = useCreateSpecialShift()

  const isOpen = open === 'create'
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
    enabled: !defaultDoctorId, // Only fetch doctors if not provided a default
  })

  const doctors = doctorsData?.data || []
  const isLoadingData = isLoadingDoctors && !defaultDoctorId

  const form = useForm<SpecialShiftFormValues>({
    resolver: zodResolver(specialShiftFormSchema),
    defaultValues: {
      doctorIds: defaultDoctorId ? [defaultDoctorId] : [],
      workLocationId: null,
      effectiveDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      reason: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        doctorIds: defaultDoctorId ? [defaultDoctorId] : [],
        workLocationId: null,
        effectiveDate: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        reason: '',
      })
    }
  }, [isOpen, form, defaultDoctorId])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }

  const onSubmit = async (values: SpecialShiftFormValues) => {
    try {
      await Promise.allSettled(
        values.doctorIds.map(async (doctorId) => {
          const requestData = {
            doctorId,
            workLocationId: null,
            effectiveDate: values.effectiveDate,
            startTime: values.startTime,
            endTime: values.endTime,
            reason: values.reason,
          }
          return createMutation.mutateAsync(requestData)
        })
      )
      handleClose()
    } catch (error) {
      console.error('Failed to create special shift:', error)
    }
  }

  const isLoading = createMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Special Shift</DialogTitle>
          <DialogDescription>
            Add an override or special shift for one or more doctors. This will
            override their regular office hours for the specified date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='doctorIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Doctor <span className='text-destructive'>*</span>
                  </FormLabel>
                  <MultiSelect
                    options={doctors.map((d) => ({
                      value: d.id,
                      label: `Dr. ${d.fullName}`,
                      subtitle: d.specialties?.[0]?.name,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                    disabled={isLoading || !!defaultDoctorId}
                    placeholder='Select one or more doctors...'
                    searchPlaceholder='Search doctor...'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='effectiveDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Effective Date <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason / Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. On-call Emergency, Extra Shift...'
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={
                  isLoading ||
                  isLoadingData ||
                  (!defaultDoctorId && doctorsError !== null)
                }
              >
                {(isLoading || isLoadingData) && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                {isLoadingData ? 'Loading...' : 'Add Special Shift'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
