import { format, parseISO } from 'date-fns'
import { CancelAppointmentDialog } from '@/calendar/components/dialogs/cancel-appointment-dialog'
import { CompleteAppointmentDialog } from '@/calendar/components/dialogs/complete-appointment-dialog'
import { ConfirmAppointmentDialog } from '@/calendar/components/dialogs/confirm-appointment-dialog'
import { EditEventDialog } from '@/calendar/components/dialogs/edit-event-dialog'
import { RescheduleAppointmentDialog } from '@/calendar/components/dialogs/reschedule-appointment-dialog'
import type { IAppointment } from '@/calendar/interfaces'
import {
  Calendar,
  User,
  MapPin,
  Stethoscope,
  DollarSign,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'

interface IProps {
  appointment: IAppointment
  children: React.ReactNode
}

const STATUS_VARIANTS = {
  BOOKED: 'secondary',
  CONFIRMED: 'default',
  RESCHEDULED: 'outline',
  CANCELLED_BY_PATIENT: 'destructive',
  CANCELLED_BY_STAFF: 'destructive',
  NO_SHOW: 'destructive',
  COMPLETED: 'default',
} as const

const STATUS_LABELS = {
  BOOKED: 'Booked',
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  CANCELLED_BY_PATIENT: 'Cancelled by Patient',
  CANCELLED_BY_STAFF: 'Cancelled by Staff',
  NO_SHOW: 'No Show',
  COMPLETED: 'Completed',
} as const

export function EventDetailsDialog({
  appointment,
  children,
}: Readonly<IProps>) {
  if (!appointment?.event) {
    return null
  }

  const serviceDate = parseISO(appointment.event.serviceDate)
  const canConfirm =
    appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED'
  const canComplete = appointment.status === 'CONFIRMED'
  const canCancel = ![
    'COMPLETED',
    'CANCELLED_BY_PATIENT',
    'CANCELLED_BY_STAFF',
  ].includes(appointment.status)
  const canReschedule = ![
    'COMPLETED',
    'CANCELLED_BY_PATIENT',
    'CANCELLED_BY_STAFF',
  ].includes(appointment.status)

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className='w-full sm:max-w-xl'>
        <SheetHeader>
          <div className='flex items-center justify-between'>
            <SheetTitle>Appointment Details</SheetTitle>
            <Badge variant={STATUS_VARIANTS[appointment.status]}>
              {STATUS_LABELS[appointment.status]}
            </Badge>
          </div>
          <SheetDescription>
            View and manage appointment details.
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 py-6'>
          <div className='flex items-start gap-3'>
            <User className='text-muted-foreground mt-1 size-5 shrink-0' />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Patient</p>
              <p className='text-sm'>{appointment.patient.fullName}</p>
              <p className='text-muted-foreground text-xs'>
                DOB:{' '}
                {appointment.patient.dateOfBirth
                  ? format(
                      parseISO(appointment.patient.dateOfBirth),
                      'MMM d, yyyy'
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <Stethoscope className='text-muted-foreground mt-1 size-5 shrink-0' />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Doctor</p>
              <p className='text-sm'>{appointment.doctor.name}</p>
              {appointment.specialty && (
                <p className='text-muted-foreground text-xs'>
                  Specialty: {appointment.specialty.name}
                </p>
              )}
            </div>
          </div>

          {appointment.location && (
            <div className='flex items-start gap-3'>
              <MapPin className='text-muted-foreground mt-1 size-5 shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Location</p>
                <p className='text-sm'>{appointment.location.name}</p>
                <p className='text-muted-foreground text-xs'>
                  {appointment.location.address}
                </p>
              </div>
            </div>
          )}

          <div className='flex items-start gap-3'>
            <Calendar className='text-muted-foreground mt-1 size-5 shrink-0' />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Date & Time</p>
              <p className='text-sm'>
                {format(serviceDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className='text-sm'>
                {appointment.event.timeStart} - {appointment.event.timeEnd}
              </p>
            </div>
          </div>

          {appointment.priceAmount && (
            <div className='flex items-start gap-3'>
              <DollarSign className='text-muted-foreground mt-1 size-5 shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Price</p>
                <p className='text-sm'>
                  {appointment.priceAmount.toLocaleString()}{' '}
                  {appointment.currency}
                </p>
              </div>
            </div>
          )}

          {appointment.reason && (
            <div className='flex items-start gap-3'>
              <FileText className='text-muted-foreground mt-1 size-5 shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Reason</p>
                <p className='text-sm'>{appointment.reason}</p>
              </div>
            </div>
          )}

          {appointment.notes && (
            <div className='flex items-start gap-3'>
              <FileText className='text-muted-foreground mt-1 size-5 shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Notes</p>
                <p className='text-sm'>{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className='text-muted-foreground grid grid-cols-2 gap-4 border-t pt-4 text-xs'>
            <div>
              <p className='text-foreground font-medium'>Created</p>
              <p>
                {format(parseISO(appointment.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <p className='text-foreground font-medium'>Updated</p>
              <p>
                {format(parseISO(appointment.updatedAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            {appointment.completedAt && (
              <div>
                <p className='text-foreground font-medium'>Completed</p>
                <p>
                  {format(
                    parseISO(appointment.completedAt),
                    'MMM d, yyyy h:mm a'
                  )}
                </p>
              </div>
            )}
            {appointment.cancelledAt && (
              <div>
                <p className='text-foreground font-medium'>Cancelled</p>
                <p>
                  {format(
                    parseISO(appointment.cancelledAt),
                    'MMM d, yyyy h:mm a'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className='flex-col gap-2 sm:flex-row'>
          <EditEventDialog appointment={appointment}>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='w-full sm:w-auto'
            >
              Update
            </Button>
          </EditEventDialog>

          {canReschedule && (
            <RescheduleAppointmentDialog appointment={appointment}>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
              >
                Reschedule
              </Button>
            </RescheduleAppointmentDialog>
          )}

          {canConfirm && (
            <ConfirmAppointmentDialog appointment={appointment}>
              <Button
                type='button'
                variant='default'
                size='sm'
                className='w-full sm:w-auto'
              >
                Confirm
              </Button>
            </ConfirmAppointmentDialog>
          )}

          {canComplete && (
            <CompleteAppointmentDialog appointment={appointment}>
              <Button
                type='button'
                variant='default'
                size='sm'
                className='w-full sm:w-auto'
              >
                Complete
              </Button>
            </CompleteAppointmentDialog>
          )}

          {canCancel && (
            <CancelAppointmentDialog appointment={appointment}>
              <Button
                type='button'
                variant='destructive'
                size='sm'
                className='w-full sm:w-auto'
              >
                Cancel
              </Button>
            </CancelAppointmentDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
