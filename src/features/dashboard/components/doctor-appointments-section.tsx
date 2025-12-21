import { useState } from 'react'
import { format, addDays, subMonths, addMonths } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  FileText,
} from 'lucide-react'
import type { AppointmentStatus } from '@/api/types/appointment.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAppointments,
  useConfirmAppointment,
} from '@/features/appointments/data/hooks'

// Helper to format date range for API
function getDateRange(startDate: Date, endDate: Date) {
  return {
    fromDate: format(startDate, 'yyyy-MM-dd'),
    toDate: format(endDate, 'yyyy-MM-dd'),
  }
}

/**
 * Pending Appointments Section
 * Shows booked appointments (need confirmation) from 2 months ago to 2 months ahead
 */
function PendingAppointmentsCard() {
  const navigate = useNavigate()
  const now = new Date()
  const twoMonthsAgo = subMonths(now, 2)
  const twoMonthsAhead = addMonths(now, 2)
  const { fromDate, toDate } = getDateRange(twoMonthsAgo, twoMonthsAhead)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const { data, isLoading } = useAppointments({
    status: 'BOOKED' as AppointmentStatus,
    fromDate,
    toDate,
    limit: 10,
    page: 1,
  })

  const { mutate: confirmAppointment } = useConfirmAppointment()

  const appointments = data?.data || []
  const total = data?.meta?.totalItems || 0

  const handleConfirm = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmingId(appointmentId)
    confirmAppointment(appointmentId, {
      onSuccess: () => setConfirmingId(null),
      onError: () => setConfirmingId(null),
    })
  }

  const handleAppointmentClick = (appointmentId: string) => {
    navigate({
      to: '/appointments',
      search: { appointmentId },
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-orange-600' />
              Pending Confirmation
            </CardTitle>
            <CardDescription>
              Appointments waiting for your confirmation
            </CardDescription>
          </div>
          <Badge variant='outline' className='text-orange-600'>
            {total} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className='h-20 w-full' />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center text-sm'>
            No pending appointments
          </div>
        ) : (
          <ScrollArea className='h-[400px] pr-4'>
            <div className='space-y-3'>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className='hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors'
                  role='button'
                  tabIndex={0}
                  onClick={() => handleAppointmentClick(apt.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleAppointmentClick(apt.id)
                    }
                  }}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-2.5'>
                      {/* Patient Name */}
                      <div className='flex items-center gap-2'>
                        <User className='text-muted-foreground h-4 w-4 flex-shrink-0' />
                        <span className='text-base font-semibold'>
                          {apt.patient?.fullName || 'Unknown Patient'}
                        </span>
                        {apt.patient?.dateOfBirth && (
                          <span className='text-muted-foreground text-xs'>
                            (Age:{' '}
                            {new Date().getFullYear() -
                              new Date(apt.patient.dateOfBirth).getFullYear()}
                            )
                          </span>
                        )}
                      </div>

                      {/* Date and Time */}
                      <div className='text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar className='h-3.5 w-3.5' />
                          <span className='font-medium'>
                            {apt.event?.serviceDate
                              ? format(
                                  new Date(apt.event.serviceDate),
                                  'EEE, MMM dd, yyyy'
                                )
                              : 'N/A'}
                          </span>
                        </div>
                        {apt.event?.timeStart && (
                          <div className='flex items-center gap-1.5'>
                            <Clock className='h-3.5 w-3.5' />
                            <span>
                              {format(new Date(apt.event.timeStart), 'HH:mm')}
                              {apt.event.timeEnd &&
                                ` - ${format(new Date(apt.event.timeEnd), 'HH:mm')}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Specialty */}
                      {apt.specialty?.name && (
                        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                          <Stethoscope className='h-3.5 w-3.5 flex-shrink-0' />
                          <span className='line-clamp-1'>
                            {apt.specialty.name}
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      {apt.location?.name && (
                        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                          <MapPin className='h-3.5 w-3.5 flex-shrink-0' />
                          <span className='line-clamp-1 font-medium'>
                            {apt.location.name}
                          </span>
                        </div>
                      )}

                      {/* Reason */}
                      {apt.reason && (
                        <div className='text-muted-foreground flex items-start gap-1.5 text-sm'>
                          <FileText className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                          <span className='line-clamp-2 italic'>
                            {apt.reason}
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      {apt.priceAmount && (
                        <div className='mt-1'>
                          <Badge
                            variant='secondary'
                            className='text-xs font-semibold'
                          >
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: apt.currency || 'VND',
                            }).format(Number(apt.priceAmount))}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <Button
                      size='sm'
                      variant='default'
                      className='flex-shrink-0'
                      disabled={confirmingId === apt.id}
                      onClick={(e) => handleConfirm(apt.id, e)}
                    >
                      {confirmingId === apt.id ? 'Confirming...' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {!isLoading &&
          appointments.length > 0 &&
          total > appointments.length && (
            <div className='mt-4 text-center'>
              <Button variant='link' asChild>
                <a href='/appointments?status=BOOKED'>
                  View all {total} pending appointments →
                </a>
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  )
}

/**
 * Upcoming Appointments Section
 * Shows confirmed appointments for today and next 2 days
 */
function UpcomingAppointmentsCard() {
  const navigate = useNavigate()
  const now = new Date()
  const twoDaysAhead = addDays(now, 2)
  const { fromDate, toDate } = getDateRange(now, twoDaysAhead)

  const { data, isLoading } = useAppointments({
    status: 'CONFIRMED' as AppointmentStatus,
    fromDate,
    toDate,
    limit: 10,
    page: 1,
  })

  const appointments = data?.data || []
  const total = data?.meta?.totalItems || 0

  const handleAppointmentClick = (appointmentId: string) => {
    navigate({
      to: '/appointments',
      search: { appointmentId },
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-green-600' />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Confirmed appointments for next 3 days
            </CardDescription>
          </div>
          <Badge variant='outline' className='text-green-600'>
            {total} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className='h-20 w-full' />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center text-sm'>
            No upcoming appointments
          </div>
        ) : (
          <ScrollArea className='h-[400px] pr-4'>
            <div className='space-y-3'>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className='hover:bg-muted/50 cursor-pointer rounded-lg border border-green-200 bg-green-50/50 p-4 transition-colors dark:border-green-900 dark:bg-green-950/20'
                  role='button'
                  tabIndex={0}
                  onClick={() => handleAppointmentClick(apt.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleAppointmentClick(apt.id)
                    }
                  }}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-2.5'>
                      {/* Patient Name */}
                      <div className='flex items-center gap-2'>
                        <User className='text-muted-foreground h-4 w-4 flex-shrink-0' />
                        <span className='text-base font-semibold'>
                          {apt.patient?.fullName || 'Unknown Patient'}
                        </span>
                        {apt.patient?.dateOfBirth && (
                          <span className='text-muted-foreground text-xs'>
                            (Age:{' '}
                            {new Date().getFullYear() -
                              new Date(apt.patient.dateOfBirth).getFullYear()}
                            )
                          </span>
                        )}
                      </div>

                      {/* Date and Time */}
                      <div className='text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar className='h-3.5 w-3.5' />
                          <span className='font-medium'>
                            {apt.event?.serviceDate
                              ? format(
                                  new Date(apt.event.serviceDate),
                                  'EEE, MMM dd, yyyy'
                                )
                              : 'N/A'}
                          </span>
                        </div>
                        {apt.event?.timeStart && (
                          <div className='flex items-center gap-1.5'>
                            <Clock className='h-3.5 w-3.5' />
                            <span>
                              {format(new Date(apt.event.timeStart), 'HH:mm')}
                              {apt.event.timeEnd &&
                                ` - ${format(new Date(apt.event.timeEnd), 'HH:mm')}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Specialty */}
                      {apt.specialty?.name && (
                        <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                          <Stethoscope className='h-3.5 w-3.5 flex-shrink-0' />
                          <span className='line-clamp-1'>
                            {apt.specialty.name}
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      {apt.location?.name && (
                        <div className='text-muted-foreground flex items-start gap-1.5 text-sm'>
                          <MapPin className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                          <div className='flex-1'>
                            <div className='font-medium'>
                              {apt.location.name}
                            </div>
                            {apt.location.address && (
                              <div className='text-xs'>
                                {apt.location.address}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Reason */}
                      {apt.reason && (
                        <div className='text-muted-foreground flex items-start gap-1.5 text-sm'>
                          <FileText className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                          <span className='line-clamp-2 italic'>
                            {apt.reason}
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      {apt.priceAmount && (
                        <div className='mt-1'>
                          <Badge
                            variant='secondary'
                            className='text-xs font-semibold'
                          >
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: apt.currency || 'VND',
                            }).format(Number(apt.priceAmount))}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-shrink-0'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAppointmentClick(apt.id)
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {!isLoading &&
          appointments.length > 0 &&
          total > appointments.length && (
            <div className='mt-4 text-center'>
              <Button variant='link' asChild>
                <a href='/appointments?status=CONFIRMED'>
                  View all {total} confirmed appointments →
                </a>
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  )
}

/**
 * Main Doctor Appointments Section
 * Combines pending and upcoming appointments
 */
export function DoctorAppointmentsSection() {
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <PendingAppointmentsCard />
      <UpcomingAppointmentsCard />
    </div>
  )
}
