import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { format, parse } from 'date-fns'
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
import { Time } from '@internationalized/date'
import { MultiSelect } from '@/components/ui/multi-select'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { TimeInput } from '@/components/ui/time-input'
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
      effectiveDate: format(new Date(), 'yyyy-MM-dd'),
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
        effectiveDate: format(new Date(), 'yyyy-MM-dd'),
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
            workLocationId: 'cm0hq6rxg000008mf3x0c6w4b',
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
          <DialogTitle>Thêm ca làm việc</DialogTitle>
          <DialogDescription>
            Thêm một ca làm việc hoặc ghi đè cho một hoặc nhiều bác sĩ. Thao tác này sẽ ghi đè
            giờ làm việc thông thường của họ cho ngày được chỉ định.
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
                    Bác sĩ <span className='text-destructive'>*</span>
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
                    placeholder='Chọn một hoặc nhiều bác sĩ...'
                    searchPlaceholder='Tìm kiếm bác sĩ...'
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
                      Ngày làm việc <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        id='effective-date-picker'
                        value={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        placeholder='Select a date'
                        disabled={isLoading}
                      />
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
                      Giờ bắt đầu <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <TimeInput
                        value={field.value ? new Time(...field.value.split(':').map(Number)) : undefined}
                        onChange={(time) => field.onChange(time ? `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}` : '')}
                        disabled={isLoading}
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
                      Giờ kết thúc <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <TimeInput
                        value={field.value ? new Time(...field.value.split(':').map(Number)) : undefined}
                        onChange={(time) => field.onChange(time ? `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}` : '')}
                        disabled={isLoading}
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
                  <FormLabel>Lý do / Ghi chú</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ví dụ: Đi học, Nghỉ ốm...'
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
                Huỷ
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
                {isLoadingData ? 'Đang tải...' : 'Thêm ca làm việc'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
