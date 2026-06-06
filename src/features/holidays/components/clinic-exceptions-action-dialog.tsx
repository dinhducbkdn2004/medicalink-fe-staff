import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
      date: new Date().toISOString().split('T')[0],
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
        date: new Date().toISOString().split('T')[0],
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
          <DialogTitle>Add Holiday</DialogTitle>
          <DialogDescription>
            Configure holidays or special closing days for the clinic.
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
                    Date <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} disabled={isLoading} />
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
                    <FormLabel>Full Day Holiday</FormLabel>
                    <FormDescription>
                      Check this if the clinic is closed for the entire day.
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
                        <Input
                          type='time'
                          {...field}
                          value={field.value || ''}
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
                          value={field.value || ''}
                          disabled={isLoading}
                          className='font-mono'
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
                  <FormLabel>Reason / Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. Independence Day, Maintenance...'
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
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                Add Holiday
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
