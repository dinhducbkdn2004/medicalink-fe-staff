/**
 * Doctor Profile Edit Form
 * Comprehensive form for editing doctor profile with all fields
 * API: PATCH /api/doctors/profile/:id
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  MapPin,
  Stethoscope,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSidebar } from '../components/profile-sidebar'
import {
  AcademicTab,
  ProfessionalTab,
  EducationTab,
  LocationsTab,
} from '../components/tabs'
import { useUpdateDoctorProfile } from '../data/use-doctor-profiles'
import { useCompleteDoctor } from '../data/use-doctors'
import { useActiveSpecialties } from '../data/use-specialties'
import { useActiveWorkLocations } from '../data/use-work-locations'
import {
  updateDoctorProfileSchema,
  type UpdateDoctorProfileFormData,
} from '../types'
import { canEditOwnProfile } from '../utils/permissions'

export interface DoctorProfileFormProps {
  onCancel?: () => void
}

export function DoctorProfileForm({ onCancel }: DoctorProfileFormProps = {}) {
  const { doctorId } = useParams({
    from: '/_authenticated/doctors/$doctorId/profile',
  })
  const navigate = useNavigate()
  const { user, accessToken } = useAuth()

  // Check permissions
  if (!canEditOwnProfile(user, doctorId)) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground mt-2'>
            You do not have permission to edit this profile.
          </p>
          <Button onClick={() => navigate({ to: '/doctors' })} className='mt-4'>
            Back to Doctors
          </Button>
        </div>
      </div>
    )
  }

  // Data fetching
  const { data: completeData, isLoading } = useCompleteDoctor(doctorId)
  const { data: specialties = [], isLoading: loadingSpecialties } =
    useActiveSpecialties()
  const { data: workLocations = [], isLoading: loadingLocations } =
    useActiveWorkLocations()
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateDoctorProfile()

  // Form setup
  const form = useForm<UpdateDoctorProfileFormData>({
    resolver: zodResolver(updateDoctorProfileSchema),
    defaultValues: {
      degree: '',
      position: [],
      introduction: '',
      memberships: [],
      awards: [],
      research: '',
      trainingProcess: [],
      experience: [],
      avatarUrl: '',
      portrait: '',
      specialtyIds: [],
      locationIds: [],
    },
  })

  // Load existing data
  useEffect(() => {
    if (completeData) {
      form.reset({
        degree: completeData.degree || '',
        position: completeData.position || [],
        introduction: completeData.introduction || '',
        memberships: completeData.memberships || [],
        awards: completeData.awards || [],
        research: completeData.research || '',
        trainingProcess: completeData.trainingProcess || [],
        experience: completeData.experience || [],
        avatarUrl: completeData.avatarUrl || '',
        portrait: completeData.portrait || '',
        specialtyIds: completeData.specialties?.map((s) => s.id) || [],
        locationIds: completeData.workLocations?.map((l) => l.id) || [],
      })
    }
  }, [completeData, form])

  const onSubmit = (data: UpdateDoctorProfileFormData) => {
    if (!completeData?.profileId) {
      toast.error('Profile ID not found')
      return
    }

    updateProfile(
      { id: completeData.profileId, data },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully')
          if (onCancel) {
            onCancel()
          }
        },
      }
    )
  }

  const handleBack = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate({ to: '/doctors' })
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin' />
          <p className='text-muted-foreground mt-4'>Loading profile...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!completeData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-medium'>Doctor not found</p>
          <Button onClick={handleBack} className='mt-4'>
            Back to Doctors
          </Button>
        </div>
      </div>
    )
  }

  const doctor = completeData

  return (
    <div className='container mx-auto max-w-6xl py-6'>
      {/* Header */}
      <div className='mb-6'>
        <Button variant='ghost' onClick={handleBack} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Profile
        </Button>
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Edit Doctor Profile
            </h2>
            <p className='text-muted-foreground mt-1'>
              Update profile information for {doctor.fullName}
            </p>
          </div>
          <Badge variant={doctor.isActive ? 'default' : 'secondary'}>
            {doctor.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-[300px_1fr]'>
            {/* LEFT COLUMN - Enhanced Profile Sidebar */}
            <ProfileSidebar
              form={form}
              doctor={doctor}
              accessToken={accessToken || ''}
            />

            {/* RIGHT COLUMN - Tabbed Profile Details */}
            <div className='space-y-4'>
              <Card>
                <CardContent className='p-6'>
                  <Tabs defaultValue='academic' className='flex flex-col gap-2 w-full'>
                    <TabsList className='grid w-full grid-cols-4'>
                      <TabsTrigger value='academic' className='gap-2 text-xs'>
                        <Briefcase className='h-4 w-4' />
                        <span className='hidden sm:inline'>Academic</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value='professional'
                        className='gap-2 text-xs'
                      >
                        <Stethoscope className='h-4 w-4' />
                        <span className='hidden sm:inline'>Professional</span>
                      </TabsTrigger>
                      <TabsTrigger value='education' className='gap-2 text-xs'>
                        <GraduationCap className='h-4 w-4' />
                        <span className='hidden sm:inline'>Education</span>
                      </TabsTrigger>
                      <TabsTrigger value='locations' className='gap-2 text-xs'>
                        <MapPin className='h-4 w-4' />
                        <span className='hidden sm:inline'>Locations</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Academic & Professional Titles */}
                    <TabsContent value='academic' className='pt-4'>
                      <AcademicTab form={form} />
                    </TabsContent>

                    {/* Tab 2: Professional Info (Introduction & Research) */}
                    <TabsContent value='professional' className='pt-4'>
                      <ProfessionalTab
                        form={form}
                        accessToken={accessToken || ''}
                      />
                    </TabsContent>

                    {/* Tab 3: Education & Experience */}
                    <TabsContent value='education' className='pt-4'>
                      <EducationTab form={form} />
                    </TabsContent>

                    {/* Tab 4: Specialties & Work Locations */}
                    <TabsContent value='locations' className='pt-4'>
                      <LocationsTab
                        form={form}
                        specialties={specialties}
                        workLocations={workLocations}
                        loadingSpecialties={loadingSpecialties}
                        loadingLocations={loadingLocations}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sticky Footer Actions */}
          <div className='bg-background/95 sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t px-6 py-4 shadow-lg backdrop-blur-sm'>
            {/* Left side - Unsaved changes indicator */}
            <div className='flex items-center gap-2'>
              {form.formState.isDirty && !isUpdating && (
                <div className='flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-amber-500' />
                  <span className='font-medium'>Unsaved changes</span>
                </div>
              )}
              {!form.formState.isDirty && !isUpdating && (
                <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span className='font-medium'>All changes saved</span>
                </div>
              )}
            </div>

            {/* Right side - Action buttons */}
            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleBack}
                disabled={isUpdating}
                className='shadow-sm'
              >
                <X className='mr-2 h-4 w-4' />
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isUpdating || !form.formState.isDirty}
                className='shadow-sm'
              >
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
