'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IAppointment } from '@/calendar/interfaces'
import {
  updateAppointmentSchema,
  type TUpdateAppointmentFormData,
} from '@/calendar/schemas'
import { appointmentService } from '@/api/services/appointment.service'
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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function EditEventDialog({ children, appointment }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data: TUpdateAppointmentFormData) =>
      appointmentService.update(appointment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      onClose()
      form.reset()
    },
  })

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
    updateMutation.mutate(values)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
          <DialogDescription>
            Update appointment details. To reschedule time/date/doctor, use the
            Reschedule action.
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
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            form='appointment-form'
            type='submit'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
