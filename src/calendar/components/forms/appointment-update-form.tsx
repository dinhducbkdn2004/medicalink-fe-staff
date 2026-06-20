import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IAppointment } from '@/calendar/interfaces'
import {
  updateAppointmentSchema,
  type TUpdateAppointmentFormData,
} from '@/calendar/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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
import { useUpdateAppointment } from '@/features/appointments/data/hooks'
import { RichTextEditor } from '@/features/doctors/components/rich-text-editor'

interface IProps {
  readonly appointment: IAppointment
  readonly onCancel: () => void
  readonly onSuccess: () => void
}

export function AppointmentUpdateForm({
  appointment,
  onCancel,
  onSuccess,
}: Readonly<IProps>) {
  const { mutate: updateAppointment, isPending } = useUpdateAppointment()
  const accessToken = useAuthStore((state) => state.accessToken)

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
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger data-invalid={fieldState.invalid}>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='BOOKED'>Đã đặt</SelectItem>
                    <SelectItem value='CONFIRMED'>Đã xác nhận</SelectItem>
                    <SelectItem value='RESCHEDULED'>Đã dời lịch</SelectItem>
                    <SelectItem value='CANCELLED_BY_PATIENT'>
                      Bệnh nhân hủy
                    </SelectItem>
                    <SelectItem value='CANCELLED_BY_STAFF'>
                      Nhân viên hủy
                    </SelectItem>
                    <SelectItem value='NO_SHOW'>Không đến</SelectItem>
                    <SelectItem value='COMPLETED'>Hoàn thành</SelectItem>
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
              <FormLabel htmlFor='reason'>Lý do khám</FormLabel>
              <FormControl>
                <Input
                  id='reason'
                  placeholder='Lý do khám'
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
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Ghi chú thêm cho lịch hẹn'
                  accessToken={accessToken || ''}
                  toolbarOptions='minimal'
                  enableImageUpload={false}
                  enableVideoUpload={false}
                  enableSyntax={false}
                  enableFormula={false}
                  size='compact'
                  className={cn(
                    'min-h-[120px]',
                    fieldState.invalid &&
                      'border-red-500 focus-within:ring-red-500'
                  )}
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
              <FormLabel>Giá (VND)</FormLabel>
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

        <div className='flex items-center justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            disabled={isPending}
            onClick={onCancel}
          >
            Hủy
          </Button>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
