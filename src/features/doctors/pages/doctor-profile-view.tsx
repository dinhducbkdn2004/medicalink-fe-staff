import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Edit, Mail, Phone, User, ChevronDown, Loader2, Star, BadgeDollarSign, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { CompleteDoctorData } from '@/api/types/doctor.types'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CollapsibleSection } from '../components/profile-view'
import { RichTextDisplay } from '../components/rich-text-editor'
import { useCompleteDoctor } from '../data/use-doctors'
import { canEditOwnProfile } from '../utils/permissions'
import { DoctorProfileForm } from './doctor-profile-form'
import { SpecialShiftsWidget } from '@/features/special-shifts'

function EmptyField({ text = 'Không có thông tin' }: { text?: string }) {
  return (
    <div className='text-muted-foreground flex items-center gap-2 text-xs italic'>
      <span>-</span>
      <span>{text}</span>
    </div>
  )
}

export function DoctorProfileView() {
  const { doctorId } = useParams({
    from: '/_authenticated/doctors/$doctorId/profile',
  })
  const { user } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)

  const { data: completeData, isLoading, error } = useCompleteDoctor(doctorId)

  const doctor = completeData as CompleteDoctorData | undefined

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-medium text-red-500'>
            Lỗi khi tải hồ sơ bác sĩ
          </p>
          <p className='text-muted-foreground mt-2 text-sm'>
            {error instanceof Error ? error.message : 'Lỗi không xác định'}
          </p>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-medium'>Không tìm thấy Bác sĩ</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Hồ sơ bác sĩ yêu cầu không tồn tại
          </p>
        </div>
      </div>
    )
  }

  const canEdit = canEditOwnProfile(user, doctorId)
  const hasProfile = Boolean(doctor.position?.length || doctor.introduction)

  if (isEditMode) {
    return <DoctorProfileForm onCancel={handleCancelEdit} />
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {}
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Hồ sơ Bác sĩ
            </h1>
            <p className='text-muted-foreground mt-1'>
              Thông tin chuyên môn chi tiết cho {doctor.fullName}
            </p>
          </div>
          {canEdit && (
            <Button onClick={handleEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Chỉnh sửa Hồ sơ
            </Button>
          )}
        </div>

        {}
        {!hasProfile && (
          <Card className='border-yellow-500/50 bg-yellow-500/10'>
            <CardContent>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-yellow-500/20 p-2'>
                  <User className='h-5 w-5 text-yellow-600' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>Hồ sơ chưa hoàn tất</h3>
                  <p className='text-muted-foreground text-sm'>
                    Hồ sơ của bác sĩ này chưa được thiết lập. Nhấp vào "Chỉnh sửa
                    Hồ sơ" để thêm thông tin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Left Column - Avatar & Basic Info */}
          <div className='space-y-4'>
            {/* Avatar Card */}
            <Card>
              <CardContent>
                <div className='flex flex-col items-center text-center'>
                  {/* Avatar with Image Preview */}
                  {doctor?.avatarUrl ? (
                    <div className='relative'>
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor?.fullName}
                        className='ring-border h-32 w-32 rounded-full object-cover ring-4'
                        onError={(e) => {
                          // Fallback to Avatar if image fails
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling
                          if (fallback) fallback.classList.remove('hidden')
                        }}
                      />
                      <Avatar className='ring-border hidden h-32 w-32 ring-4'>
                        <AvatarFallback className='text-2xl'>
                          <User className='h-16 w-16' />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className='relative'>
                      <Avatar className='ring-border h-32 w-32 ring-4'>
                        <AvatarFallback className='bg-muted text-2xl'>
                          <User className='h-16 w-16' />
                        </AvatarFallback>
                      </Avatar>
                      <EmptyField text='Chưa tải ảnh đại diện' />
                    </div>
                  )}

                  <h2 className='mt-4 text-2xl font-bold'>
                    {doctor?.fullName || 'Bác sĩ không xác định'}
                  </h2>

                  {doctor?.position?.[0] ? (
                    <p className='text-muted-foreground text-sm'>
                      {doctor.position[0]}
                    </p>
                  ) : (
                    <EmptyField text='Chưa xác định chức vụ' />
                  )}

                  {/* Active Status */}
                  <div className='mt-4'>
                    <Badge variant={doctor?.isActive ? 'default' : 'secondary'}>
                      {doctor?.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className='mt-4 grid w-full grid-cols-3 divide-x rounded-lg border bg-card py-3 text-center'>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <div className='flex items-center text-sm font-medium'>
                        <Star className='mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
                        {doctor?.ratings || 'N/A'}
                      </div>
                      <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>Đánh giá</span>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <div className='flex items-center text-sm font-medium'>
                        <BadgeDollarSign className='mr-1 h-3.5 w-3.5 text-green-500' />
                        {doctor?.serviceCost ? `${doctor.serviceCost} VNĐ` : 'N/A'}
                      </div>
                      <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>Chi phí</span>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <div className='flex items-center text-sm font-medium'>
                        <Clock className='mr-1 h-3.5 w-3.5 text-blue-500' />
                        {doctor?.experienceYears ? `${doctor.experienceYears}y` : 'N/A'}
                      </div>
                      <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>Kinh nghiệm</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className='mt-6 w-full space-y-2 text-left'>
                    <div className='bg-muted/50 rounded-md p-3'>
                      <div className='text-muted-foreground mb-1 text-xs font-medium'>
                        Email
                      </div>
                      {doctor?.email ? (
                        <div className='flex items-center gap-2 text-sm'>
                          <Mail className='text-muted-foreground h-4 w-4' />
                          <span className='truncate'>{doctor.email}</span>
                        </div>
                      ) : (
                        <EmptyField text='Không có email' />
                      )}
                    </div>
                    <div className='bg-muted/50 rounded-md p-3'>
                      <div className='text-muted-foreground mb-1 text-xs font-medium'>
                        Số điện thoại
                      </div>
                      {doctor?.phone ? (
                        <div className='flex items-center gap-2 text-sm'>
                          <Phone className='text-muted-foreground h-4 w-4' />
                          <span>{doctor.phone}</span>
                        </div>
                      ) : (
                        <EmptyField text='Không có số điện thoại' />
                      )}
                    </div>
                    <div className='bg-muted/50 rounded-md p-3'>
                      <div className='text-muted-foreground mb-1 text-xs font-medium'>
                        Thông tin cá nhân
                      </div>
                      <div className='flex flex-col gap-2 text-sm'>
                        <div className='flex items-center gap-2'>
                          <User className='text-muted-foreground h-4 w-4' />
                          <span>{doctor?.isMale === undefined ? 'Không xác định' : doctor.isMale ? 'Nam' : 'Nữ'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='text-muted-foreground h-4 w-4' />
                          <span>{doctor?.dateOfBirth ? format(new Date(doctor.dateOfBirth), 'PPP') : 'Không có ngày sinh'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Positions Card */}
            <CollapsibleSection title='Chức vụ'>
              {doctor?.position && doctor.position.length > 0 ? (
                <ul className='space-y-2'>
                  {doctor.position.map((pos: string, idx: number) => (
                    <li key={idx} className='text-sm'>
                      • {pos}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyField text='Không có chức vụ nào' />
              )}
            </CollapsibleSection>

            {/* Specialties Card */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm'>Chuyên khoa</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <ChevronDown className='h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Chuyển đổi chuyên khoa</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.specialties && doctor.specialties.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {doctor.specialties.map(
                          (specialty: { id: string; name: string }) => (
                            <Badge key={specialty.id} variant='outline'>
                              {specialty.name}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <EmptyField text='Không có chuyên khoa nào' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Patient Groups Card */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm'>Nhóm bệnh nhân</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <ChevronDown className='h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Chuyển đổi nhóm bệnh nhân</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.patientGroups && doctor.patientGroups.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {doctor.patientGroups.map(
                          (group: string, idx: number) => (
                            <Badge key={idx} variant='secondary'>
                              {group}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <EmptyField text='Không có nhóm bệnh nhân nào' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Work Locations Card */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm'>Nơi làm việc</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <ChevronDown className='h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Chuyển đổi nơi làm việc</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.workLocations &&
                    doctor.workLocations.length > 0 ? (
                      <ul className='space-y-3'>
                        {doctor.workLocations.map(
                          (location: {
                            id: string
                            name: string
                            address?: string
                          }) => (
                            <li key={location.id} className='text-sm'>
                              <div className='font-medium'>{location.name}</div>
                              {location.address && (
                                <div className='text-muted-foreground text-xs'>
                                  {location.address}
                                </div>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <EmptyField text='Không có nơi làm việc nào' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Special Shifts Widget */}
            <SpecialShiftsWidget doctorId={doctorId} />
          </div>

          {/* Right Column - Detailed Information */}
          <div className='space-y-4 md:col-span-2'>
            {/* Introduction */}
            <CollapsibleSection
              title='Giới thiệu'
              description='Nền tảng chuyên môn và tổng quan'
            >
              {doctor?.introduction ? (
                <RichTextDisplay content={doctor.introduction} />
              ) : (
                <EmptyField text='Không có lời giới thiệu' />
              )}
            </CollapsibleSection>

            {/* Education */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-base'>
                        Học vấn
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        Quá trình học tập và đào tạo
                      </CardDescription>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Chuyển đổi học vấn</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.education && doctor.education.length > 0 ? (
                      <ul className='space-y-3'>
                        {doctor.education.map((edu: string, idx: number) => (
                          <li key={idx} className='flex gap-3'>
                            <div className='bg-primary/10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                              <div className='bg-primary h-2 w-2 rounded-full' />
                            </div>
                            <p className='text-sm'>{edu}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyField text='Không có thông tin học vấn' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Experience */}
            <CollapsibleSection
              title='Kinh nghiệm làm việc'
              description='Lịch sử làm việc và lộ trình nghề nghiệp'
              defaultOpen={true}
            >
              {doctor?.experience && doctor.experience.length > 0 ? (
                <ul className='space-y-3'>
                  {doctor.experience.map((exp: string, idx: number) => (
                    <li key={idx} className='flex gap-3'>
                      <div className='bg-primary/10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                        <div className='bg-primary h-2 w-2 rounded-full' />
                      </div>
                      <p className='text-sm'>{exp}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyField text='Không có kinh nghiệm' />
              )}
            </CollapsibleSection>

            {/* Expertise & Procedures */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CollapsibleSection
                title='Sở trường chuyên môn'
                description='Các kỹ năng y tế chuyên biệt'
                defaultOpen={true}
              >
                {doctor?.expertise && doctor.expertise.length > 0 ? (
                  <ul className='space-y-2'>
                    {doctor.expertise.map((item: string, idx: number) => (
                      <li key={idx} className='text-sm'>
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyField text='Không có sở trường' />
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title='Thủ thuật y khoa'
                description='Các thủ thuật y khoa đã thực hiện'
                defaultOpen={true}
              >
                {doctor?.procedures && doctor.procedures.length > 0 ? (
                  <ul className='space-y-2'>
                    {doctor.procedures.map((item: string, idx: number) => (
                      <li key={idx} className='text-sm'>
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyField text='Không có thủ thuật' />
                )}
              </CollapsibleSection>
            </div>

            {/* Conditions & Symptoms */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CollapsibleSection
                title='Bệnh lý điều trị'
                description='Các bệnh lý được quản lý'
                defaultOpen={true}
              >
                {doctor?.conditions && doctor.conditions.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {doctor.conditions.map((item: string, idx: number) => (
                      <Badge key={idx} variant='outline' className='font-normal'>
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <EmptyField text='Không có bệnh lý' />
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title='Triệu chứng thăm khám'
                description='Các triệu chứng thường gặp'
                defaultOpen={true}
              >
                {doctor?.symptoms && doctor.symptoms.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {doctor.symptoms.map((item: string, idx: number) => (
                      <Badge key={idx} variant='outline' className='font-normal'>
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <EmptyField text='Không có triệu chứng' />
                )}
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
