import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CancelAppointmentDialog } from '@/calendar/components/dialogs/cancel-appointment-dialog'
import { CompleteAppointmentDialog } from '@/calendar/components/dialogs/complete-appointment-dialog'
import { ConfirmAppointmentDialog } from '@/calendar/components/dialogs/confirm-appointment-dialog'
import { AppointmentRescheduleForm } from '@/calendar/components/forms/appointment-reschedule-form'
import { AppointmentUpdateForm } from '@/calendar/components/forms/appointment-update-form'
import type { IAppointment } from '@/calendar/interfaces'
import {
  Calendar,
  User,
  MapPin,
  Stethoscope,
  DollarSign,
  FileText,
  ArrowLeft,
  Brain,
  AlertTriangle,
} from 'lucide-react'
import { formatShiftTime } from '@/lib/utils'
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

interface IAITriageData {
  is_emergency?: boolean;
  triage_level?: string;
  emergency_reason?: string;
  extracted_symptoms?: string[];
  negated_symptoms?: string[];
  note?: string;
  severity?: string;
  duration?: string;
}

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
  const [isEditing, setIsEditing] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)

  if (!appointment?.event) {
    return null
  }

  const aiData = aiData as unknown as IAITriageData | undefined

  const hasDoctorAssigned = appointment.doctor !== null
  const canConfirm =
    hasDoctorAssigned &&
    (appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED')
  const canComplete = hasDoctorAssigned && appointment.status === 'CONFIRMED'
  const canCancel = ![
    'COMPLETED',
    'CANCELLED_BY_PATIENT',
    'CANCELLED_BY_STAFF',
  ].includes(appointment.status)
  const canReschedule =
    hasDoctorAssigned &&
    !['COMPLETED', 'CANCELLED_BY_PATIENT', 'CANCELLED_BY_STAFF'].includes(
      appointment.status
    )

  const resetView = () => {
    setIsEditing(false)
    setIsRescheduling(false)
  }

  const getTitle = () => {
    if (isEditing) return 'Update Appointment'
    if (isRescheduling) return 'Reschedule Appointment'
    return 'Appointment Details'
  }

  const getDescription = () => {
    if (isEditing) return 'Update appointment details below.'
    if (isRescheduling)
      return 'Update the appointment date, time, doctor, or location.'
    return 'View and manage appointment details.'
  }

  const isActionView = isEditing || isRescheduling

  return (
    <Sheet onOpenChange={resetView}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className='flex w-full flex-col sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
        <SheetHeader>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              {isActionView && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='-ml-2 h-8 w-8'
                  onClick={resetView}
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
              )}
              <SheetTitle>{getTitle()}</SheetTitle>
            </div>
            {!isActionView && (
              <Badge variant={STATUS_VARIANTS[appointment.status]}>
                {STATUS_LABELS[appointment.status]}
              </Badge>
            )}
          </div>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-6'>
          {isEditing ? (
            <AppointmentUpdateForm
              appointment={appointment}
              onCancel={resetView}
              onSuccess={resetView}
            />
          ) : isRescheduling ? (
            <AppointmentRescheduleForm
              appointment={appointment}
              onCancel={resetView}
              onSuccess={resetView}
            />
          ) : (
            <div className='space-y-6'>
              {}
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {}
                <div className='space-y-4'>
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
                      <p className='text-sm'>
                        {appointment.doctor?.name || 'Deleted Doctor'}
                      </p>
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
                </div>

                {}
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <Calendar className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>Date & Time</p>
                      <p className='text-sm'>
                        {format(
                          parseISO(appointment.event.serviceDate),
                          'MMM d, yyyy'
                        )}{' '}
                        • {formatShiftTime(appointment.event.timeStart)} -{' '}
                        {formatShiftTime(appointment.event.timeEnd)}
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
                </div>
              </div>

              {}
              {appointment.notes && (
                <div className='border-t pt-6'>
                  <div className='flex items-start gap-3'>
                    <FileText className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm font-medium'>Notes</p>
                      <div
                        className='prose prose-sm max-w-none text-sm'
                        dangerouslySetInnerHTML={{ __html: appointment.notes }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {aiData && (
                <div className='border-t pt-6'>
                  <div className='flex items-start gap-3'>
                    <Brain className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium'>
                          AI Clinical Summary
                        </p>
                        {aiData.is_emergency && (
                          <Badge
                            variant='destructive'
                            className='h-5 px-1.5 text-[10px]'
                          >
                            <AlertTriangle className='mr-1 h-3 w-3' />
                            Emergency Flag
                          </Badge>
                        )}
                        {aiData.triage_level &&
                          !aiData.is_emergency && (
                            <Badge
                              variant='outline'
                              className='h-5 px-1.5 text-[10px] uppercase'
                            >
                              {aiData.triage_level}
                            </Badge>
                          )}
                      </div>

                      <div className='bg-muted/50 rounded-lg border p-3 text-sm'>
                        {aiData.emergency_reason && (
                          <div className='text-destructive mb-2 text-xs font-medium'>
                            Emergency Reason:{' '}
                            {aiData.emergency_reason}
                          </div>
                        )}

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                          {aiData.extracted_symptoms?.length >
                            0 && (
                            <div>
                              <p className='text-muted-foreground mb-1 text-xs font-medium'>
                                Extracted Symptoms
                              </p>
                              <ul className='list-inside list-disc space-y-0.5 text-xs'>
                                {aiData.extracted_symptoms.map(
                                  (s: string, i: number) => (
                                    <li key={i}>{s}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {aiData.negated_symptoms?.length >
                            0 && (
                            <div>
                              <p className='text-muted-foreground mb-1 text-xs font-medium'>
                                Negated Symptoms
                              </p>
                              <ul className='list-inside list-disc space-y-0.5 text-xs'>
                                {aiData.negated_symptoms.map(
                                  (s: string, i: number) => (
                                    <li
                                      key={i}
                                      className='text-muted-foreground'
                                    >
                                      {s}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {aiData.note && (
                          <div className='mt-3 border-t pt-2'>
                            <p className='text-muted-foreground mb-1 text-xs font-medium'>
                              AI Note
                            </p>
                            <p className='text-xs'>
                              {aiData.note}
                            </p>
                          </div>
                        )}

                        {(aiData.severity ||
                          aiData.duration) && (
                          <div className='text-muted-foreground mt-2 flex gap-4 text-xs'>
                            {aiData.severity && (
                              <span>
                                Severity: {aiData.severity}
                              </span>
                            )}
                            {aiData.duration && (
                              <span>
                                Duration: {aiData.duration}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='text-muted-foreground grid grid-cols-2 gap-4 border-t pt-4 text-xs'>
                <div>
                  <p className='text-foreground font-medium'>Created</p>
                  <p>
                    {format(
                      parseISO(appointment.createdAt),
                      'MMM d, yyyy HH:mm'
                    )}
                  </p>
                </div>
                <div>
                  <p className='text-foreground font-medium'>Updated</p>
                  <p>
                    {format(
                      parseISO(appointment.updatedAt),
                      'MMM d, yyyy HH:mm'
                    )}
                  </p>
                </div>
                {appointment.completedAt && (
                  <div>
                    <p className='text-foreground font-medium'>Completed</p>
                    <p>
                      {format(
                        parseISO(appointment.completedAt),
                        'MMM d, yyyy HH:mm'
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
                        'MMM d, yyyy HH:mm'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!isActionView && (
          <SheetFooter className='flex-col gap-2 sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='w-full sm:w-auto'
              onClick={() => setIsEditing(true)}
            >
              Update
            </Button>

            {canReschedule && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
                onClick={() => setIsRescheduling(true)}
              >
                Reschedule
              </Button>
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
        )}
      </SheetContent>
    </Sheet>
  )
}
