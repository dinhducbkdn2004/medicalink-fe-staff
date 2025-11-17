'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IAppointment } from '@/calendar/interfaces'
import { CheckCircle2 } from 'lucide-react'
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

interface IProps {
  children: React.ReactNode
  appointment: IAppointment
}

export function CompleteAppointmentDialog({
  children,
  appointment,
}: Readonly<IProps>) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const queryClient = useQueryClient()

  const completeMutation = useMutation({
    mutationFn: () => appointmentService.complete(appointment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      onClose()
    },
  })

  const handleComplete = () => {
    completeMutation.mutate()
  }

  if (!appointment?.event) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle2 className='size-5 text-green-600' />
            Mark Appointment as Completed
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this appointment as completed? This
            action will update the appointment status and record the completion
            time.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='bg-muted space-y-2 rounded-lg p-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Patient:</span>
              <span className='font-medium'>
                {appointment.patient.fullName}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Doctor:</span>
              <span className='font-medium'>{appointment.doctor.name}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Date:</span>
              <span className='font-medium'>
                {appointment.event.serviceDate}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Time:</span>
              <span className='font-medium'>
                {appointment.event.timeStart} - {appointment.event.timeEnd}
              </span>
            </div>
            {appointment.reason && (
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Reason:</span>
                <span className='font-medium'>{appointment.reason}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              disabled={completeMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type='button'
            onClick={handleComplete}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? 'Completing...' : 'Mark as Completed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
