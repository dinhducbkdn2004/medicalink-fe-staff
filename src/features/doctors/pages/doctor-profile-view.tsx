/**
 * Doctor Profile View Page
 * Displays doctor profile information in read-only mode with collapsible sections
 */
import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Edit, Mail, Phone, User, ChevronDown, Loader2 } from 'lucide-react'
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

// ============================================================================
// Empty Field Component
// ============================================================================

function EmptyField({ text = 'No information provided' }: { text?: string }) {
  return (
    <div className='text-muted-foreground flex items-center gap-2 text-xs italic'>
      <span>-</span>
      <span>{text}</span>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function DoctorProfileView() {
  const { doctorId } = useParams({
    from: '/_authenticated/doctors/$doctorId/profile',
  })
  const { user } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)

  const { data: completeData, isLoading, error } = useCompleteDoctor(doctorId)

  // Log data for debugging (development only)
  useEffect(() => {
    if (completeData && import.meta.env.DEV) {
      // console.log('Complete Doctor Data:', completeData)
    }
  }, [completeData])

  // Explicit type assertion to help TypeScript (flat structure from API)
  const doctor = completeData as CompleteDoctorData | undefined

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>Loading...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-medium text-red-500'>
            Error loading doctor profile
          </p>
          <p className='text-muted-foreground mt-2 text-sm'>
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!doctor) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-medium'>Doctor not found</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            The requested doctor profile does not exist
          </p>
        </div>
      </div>
    )
  }

  // API returns flat structure (account + profile merged)
  const canEdit = canEditOwnProfile(user, doctorId)
  const hasProfile = Boolean(doctor.degree || doctor.introduction)

  // If in edit mode, show the form
  if (isEditMode) {
    return <DoctorProfileForm onCancel={handleCancelEdit} />
  }

  // View Mode
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
        {/* Page Header */}
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Doctor Profile
            </h1>
            <p className='text-muted-foreground mt-1'>
              Detailed professional information for {doctor.fullName}
            </p>
          </div>
          {canEdit && (
            <Button onClick={handleEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Empty Profile Warning */}
        {!hasProfile && (
          <Card className='border-yellow-500/50 bg-yellow-500/10'>
            <CardContent>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-yellow-500/20 p-2'>
                  <User className='h-5 w-5 text-yellow-600' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>Profile Not Completed</h3>
                  <p className='text-muted-foreground text-sm'>
                    This doctor's profile has not been set up yet. Click "Edit
                    Profile" to add information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='grid gap-4 md:grid-cols-3'>
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
                      <EmptyField text='No avatar uploaded' />
                    </div>
                  )}

                  <h2 className='mt-4 text-2xl font-bold'>
                    {doctor?.fullName || 'Unknown Doctor'}
                  </h2>

                  {doctor?.degree ? (
                    <p className='text-muted-foreground text-sm'>
                      {doctor.degree}
                    </p>
                  ) : (
                    <EmptyField text='No degree specified' />
                  )}

                  {/* Active Status */}
                  <div className='mt-4'>
                    <Badge variant={doctor?.isActive ? 'default' : 'secondary'}>
                      {doctor?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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
                        <EmptyField text='No email provided' />
                      )}
                    </div>
                    <div className='bg-muted/50 rounded-md p-3'>
                      <div className='text-muted-foreground mb-1 text-xs font-medium'>
                        Phone
                      </div>
                      {doctor?.phone ? (
                        <div className='flex items-center gap-2 text-sm'>
                          <Phone className='text-muted-foreground h-4 w-4' />
                          <span>{doctor.phone}</span>
                        </div>
                      ) : (
                        <EmptyField text='No phone number' />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Positions Card */}
            <CollapsibleSection title='Positions'>
              {doctor?.position && doctor.position.length > 0 ? (
                <ul className='space-y-2'>
                  {doctor.position.map((pos: string, idx: number) => (
                    <li key={idx} className='text-sm'>
                      • {pos}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyField text='No positions listed' />
              )}
            </CollapsibleSection>

            {/* Specialties Card */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm'>Specialties</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <ChevronDown className='h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Toggle specialties</span>
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
                      <EmptyField text='No specialties assigned' />
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
                    <CardTitle className='text-sm'>Work Locations</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <ChevronDown className='h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Toggle locations</span>
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
                      <EmptyField text='No work locations assigned' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Right Column - Detailed Information */}
          <div className='space-y-4 md:col-span-2'>
            {/* Introduction */}
            <CollapsibleSection
              title='Introduction'
              description='Professional background and overview'
            >
              {doctor?.introduction ? (
                <RichTextDisplay content={doctor.introduction} />
              ) : (
                <EmptyField text='No introduction provided' />
              )}
            </CollapsibleSection>

            {/* Research & Publications */}
            <CollapsibleSection
              title='Research & Publications'
              description='Scientific work and contributions'
              defaultOpen={false}
            >
              {doctor?.research ? (
                <RichTextDisplay content={doctor.research} />
              ) : (
                <EmptyField text='No research information provided' />
              )}
            </CollapsibleSection>

            {/* Training Process */}
            <Collapsible defaultOpen={false}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-base'>
                        Training Process
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        Educational background and training
                      </CardDescription>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Toggle training</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.trainingProcess &&
                    doctor.trainingProcess.length > 0 ? (
                      <ul className='space-y-3'>
                        {doctor.trainingProcess.map(
                          (training: string, idx: number) => (
                            <li key={idx} className='flex gap-3'>
                              <div className='bg-primary/10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                                <div className='bg-primary h-2 w-2 rounded-full' />
                              </div>
                              <p className='text-sm'>{training}</p>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <EmptyField text='No training process documented' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Experience */}
            <CollapsibleSection
              title='Professional Experience'
              description='Work history and career timeline'
              defaultOpen={false}
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
                <EmptyField text='No experience documented' />
              )}
            </CollapsibleSection>

            {/* Memberships */}
            <Collapsible defaultOpen={false}>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-base'>
                        Professional Memberships
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        Organizations and professional associations
                      </CardDescription>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
                        <span className='sr-only'>Toggle memberships</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    {doctor?.memberships && doctor.memberships.length > 0 ? (
                      <ul className='space-y-2'>
                        {doctor.memberships.map(
                          (membership: string, idx: number) => (
                            <li key={idx} className='text-sm'>
                              • {membership}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <EmptyField text='No memberships listed' />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Awards */}
            <CollapsibleSection
              title='Awards & Recognition'
              description='Honors and achievements'
              defaultOpen={false}
            >
              {doctor?.awards && doctor.awards.length > 0 ? (
                <ul className='space-y-2'>
                  {doctor.awards.map((award: string, idx: number) => (
                    <li key={idx} className='text-sm'>
                      🏆 {award}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyField text='No awards listed' />
              )}
            </CollapsibleSection>
          </div>
        </div>
      </Main>
    </>
  )
}
