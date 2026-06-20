import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { TimeInput } from '@/components/ui/time-input'
import { Time } from '@internationalized/date'
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
  clinicExceptionFormSchema,
  type ClinicExceptionFormValues,
} from '../data/schema'
import { useCreateClinicException } from '../data/use-clinic-exceptions'
import { useHolidaysContext } from './holidays-provider'

export function ClinicExceptionsActionDialog() {
  const { open, setOpen, setCurrentRow } = useHolidaysContext()
  const createMutation = useCreateClinicException()

  const isOpen = open === 'create'

  const form = useForm<ClinicExceptionFormValues>({
    resolver: zodResolver(clinicExceptionFormSchema),
    defaultValues: {
      workLocationId: null,
      date: format(new Date(), 'yyyy-MM-dd'),
      isFullDay: true,
      startTime: '',
      endTime: '',
      reason: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        workLocationId: null,
        date: format(new Date(), 'yyyy-MM-dd'),
        isFullDay: true,
        startTime: '',
        endTime: '',
        reason: '',
      })
    }
  }, [isOpen, form])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
    form.reset()
  }

  const onSubmit = async (values: ClinicExceptionFormValues) => {
    try {
      const requestData = {
        workLocationId: null,
        date: values.date,
        isFullDay: values.isFullDay,
        startTime: values.isFullDay ? null : values.startTime,
        endTime: values.isFullDay ? null : values.endTime,
        reason: values.reason || null,
      }

      await createMutation.mutateAsync(requestData)
      handleClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending
  const isFullDay = form.watch('isFullDay')

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thêm ngày nghỉ</DialogTitle>
          <DialogDescription>
            Thêm ngày nghỉ hoặc ngày đóng cửa đặc biệt cho phòng khám.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Scope (Location) removed for Single Location App */}

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        id='date-picker'
                        value={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        placeholder='Chọn ngày'
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name='isFullDay'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Ngày nghỉ trong ngày</FormLabel>
                    <FormDescription>
                      Chọn nếu phòng khám đóng cửa cả ngày.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {!isFullDay && (
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
                        Thời gian kết thúc <span className='text-destructive'>*</span>
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
            )}

            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do / Ghi chú</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ví dụ: Ngày Quốc khánh, Bảo trì...'
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
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                Thêm ngày nghỉ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
