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
  BOOKED: 'Đã đặt',
  CONFIRMED: 'Đã xác nhận',
  RESCHEDULED: 'Đã dời lịch',
  CANCELLED_BY_PATIENT: 'Bệnh nhân hủy',
  CANCELLED_BY_STAFF: 'Nhân viên hủy',
  NO_SHOW: 'Không đến',
  COMPLETED: 'Đã hoàn thành',
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

  const aiData = appointment.aiTriageData as unknown as IAITriageData | undefined

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
    if (isEditing) return 'Cập nhật lịch hẹn'
    if (isRescheduling) return 'Dời lịch hẹn'
    return 'Chi tiết lịch hẹn'
  }

  const getDescription = () => {
    if (isEditing) return 'Cập nhật chi tiết lịch hẹn dưới đây.'
    if (isRescheduling)
      return 'Cập nhật ngày, giờ, bác sĩ hoặc địa điểm khám.'
    return 'Xem và quản lý chi tiết lịch hẹn.'
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
                      <p className='text-sm font-medium'>Bệnh nhân</p>
                      <p className='text-sm'>{appointment.patient.fullName}</p>
                      <p className='text-muted-foreground text-xs'>
                        Ngày sinh:{' '}
                        {appointment.patient.dateOfBirth
                          ? format(
                              parseISO(appointment.patient.dateOfBirth),
                              'dd/MM/yyyy'
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Stethoscope className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>Bác sĩ</p>
                      <p className='text-sm'>
                        {appointment.doctor?.name || 'Bác sĩ đã bị xóa'}
                      </p>
                      {appointment.specialty && (
                        <p className='text-muted-foreground text-xs'>
                          Chuyên khoa: {appointment.specialty.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {appointment.location && (
                    <div className='flex items-start gap-3'>
                      <MapPin className='text-muted-foreground mt-1 size-5 shrink-0' />
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>Địa điểm</p>
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
                      <p className='text-sm font-medium'>Ngày & Giờ</p>
                      <p className='text-sm'>
                        {format(
                          parseISO(appointment.event.serviceDate),
                          'dd/MM/yyyy'
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
                        <p className='text-sm font-medium'>Giá</p>
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
                        <p className='text-sm font-medium'>Lý do khám</p>
                        <p className='text-sm'>{appointment.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {}
              {appointment.notes && (
                <div className='border-t'>
                  <div className='flex items-start gap-3'>
                    <FileText className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm font-medium'>Ghi chú</p>
                      <div
                        className='prose prose-sm max-w-none text-sm'
                        dangerouslySetInnerHTML={{ __html: appointment.notes }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {aiData && (
                <div className='border-t'>
                  <div className='flex items-start gap-3'>
                    <Brain className='text-muted-foreground mt-1 size-5 shrink-0' />
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium'>
                          Tóm tắt lâm sàng (AI)
                        </p>
                        {aiData.is_emergency && (
                          <Badge
                            variant='destructive'
                            className='h-5 px-1.5 text-[10px]'
                          >
                            <AlertTriangle className='mr-1 h-3 w-3' />
                            Cảnh báo khẩn cấp
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
                            Lý do khẩn cấp:{' '}
                            {aiData.emergency_reason}
                          </div>
                        )}

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                          {(aiData.extracted_symptoms?.length ?? 0) >
                            0 && (
                            <div>
                              <p className='text-muted-foreground mb-1 text-xs font-medium'>
                                Triệu chứng phát hiện
                              </p>
                              <ul className='list-inside list-disc space-y-0.5 text-xs'>
                                {aiData.extracted_symptoms?.map(
                                  (s: string, i: number) => (
                                    <li key={i}>{s}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {(aiData.negated_symptoms?.length ?? 0) >
                            0 && (
                            <div>
                              <p className='text-muted-foreground mb-1 text-xs font-medium'>
                                Triệu chứng loại trừ
                              </p>
                              <ul className='list-inside list-disc space-y-0.5 text-xs'>
                                {aiData.negated_symptoms?.map(
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
                              Ghi chú AI
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
                                Mức độ: {aiData.severity}
                              </span>
                            )}
                            {aiData.duration && (
                              <span>
                                Thời gian: {aiData.duration}
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
                  <p className='text-foreground font-medium'>Ngày tạo</p>
                  <p>
                    {format(
                      parseISO(appointment.createdAt),
                      'dd/MM/yyyy HH:mm'
                    )}
                  </p>
                </div>
                <div>
                  <p className='text-foreground font-medium'>Ngày cập nhật</p>
                  <p>
                    {format(
                      parseISO(appointment.updatedAt),
                      'dd/MM/yyyy HH:mm'
                    )}
                  </p>
                </div>
                {appointment.completedAt && (
                  <div>
                    <p className='text-foreground font-medium'>Hoàn thành</p>
                    <p>
                      {format(
                        parseISO(appointment.completedAt),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </p>
                  </div>
                )}
                {appointment.cancelledAt && (
                  <div>
                    <p className='text-foreground font-medium'>Đã hủy</p>
                    <p>
                      {format(
                        parseISO(appointment.cancelledAt),
                        'dd/MM/yyyy HH:mm'
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
              Cập nhật
            </Button>

            {canReschedule && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
                onClick={() => setIsRescheduling(true)}
              >
                Dời lịch
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
                  Xác nhận
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
                  Hoàn thành
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
                  Hủy
                </Button>
              </CancelAppointmentDialog>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
