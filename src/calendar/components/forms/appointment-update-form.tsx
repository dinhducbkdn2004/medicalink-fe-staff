import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IAppointment } from '@/calendar/interfaces'
import {
  updateAppointmentSchema,
  type TUpdateAppointmentFormData,
} from '@/calendar/schemas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateAppointment } from '@/features/appointments/data/hooks'

interface IProps {
  appointment: IAppointment
  onCancel: () => void
  onSuccess: () => void
}

export function AppointmentUpdateForm({
  appointment,
  onCancel,
  onSuccess,
}: IProps) {
  const { mutate: updateAppointment, isPending } = useUpdateAppointment()

  const form = useForm<TUpdateAppointmentFormData>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      status: appointment.status,
      notes: appointment.notes || '',
      priceAmount: appointment.priceAmount || undefined,
      reason: appointment.reason || '',
    },
  })

  const onSubmit = (values: TUpdateAppointmentFormData) => {
    updateAppointment(
      { id: appointment.id, data: values },
      {
        onSuccess: () => {
          onSuccess()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        id='appointment-update-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
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
                    <SelectItem value='RESCHEDULED'>Rescheduled</SelectItem>
                    <SelectItem value='CANCELLED_BY_PATIENT'>
                      Cancelled by Patient
                    </SelectItem>
                    <SelectItem value='CANCELLED_BY_STAFF'>
                      Cancelled by Staff
                    </SelectItem>
                    <SelectItem value='NO_SHOW'>No Show</SelectItem>
                    <SelectItem value='COMPLETED'>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className='min-h-[100px]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='priceAmount'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Price Amount</FormLabel>
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
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
