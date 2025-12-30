
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import {
  Loader2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  MapPin,
  Stethoscope,
} from 'lucide-react'
import { toast } from 'sonner'
import type { CompleteDoctorData } from '@/api/types/doctor.types'
import { useAuthStore } from '@/stores/auth-store'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
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
  const { user } = useAuth()
  const accessToken = useAuthStore((state) => state.accessToken)

  
  const { data: completeData, isLoading } = useCompleteDoctor(doctorId)
  const { data: specialties = [], isLoading: loadingSpecialties } =
    useActiveSpecialties()
  const { data: workLocations = [], isLoading: loadingLocations } =
    useActiveWorkLocations()
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateDoctorProfile()

  
  const doctor = completeData as CompleteDoctorData | undefined

  
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

  
  useEffect(() => {
    if (doctor) {
      form.reset({
        degree: doctor.degree || '',
        position: doctor.position || [],
        introduction: doctor.introduction || '',
        memberships: doctor.memberships || [],
        awards: doctor.awards || [],
        research: doctor.research || '',
        trainingProcess: doctor.trainingProcess || [],
        experience: doctor.experience || [],
        avatarUrl: doctor.avatarUrl || '',
        portrait: doctor.portrait || '',
        specialtyIds: doctor.specialties?.map((s) => s.id) || [],
        locationIds: doctor.workLocations?.map((l) => l.id) || [],
      })
    }
  }, [doctor, form])

  
  const hasPermission = canEditOwnProfile(user, doctorId)
  if (!hasPermission) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground mt-2'>
            You do not have permission to edit this profile.
          </p>
        </div>
      </div>
    )
  }

  const onSubmit = (data: UpdateDoctorProfileFormData) => {
    if (!doctor?.profileId) {
      toast.error('Profile ID not found')
      return
    }

    updateProfile(
      { id: doctor.profileId, data },
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-[300px_1fr]'>
              {}
              <ProfileSidebar
                form={form}
                doctor={doctor}
                accessToken={accessToken || ''}
              />

              {}
              <div className='space-y-4'>
                <Card>
                  <CardContent className='p-6'>
                    <Tabs
                      defaultValue='academic'
                      className='flex w-full flex-col gap-2'
                    >
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
                        <TabsTrigger
                          value='education'
                          className='gap-2 text-xs'
                        >
                          <GraduationCap className='h-4 w-4' />
                          <span className='hidden sm:inline'>Education</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value='locations'
                          className='gap-2 text-xs'
                        >
                          <MapPin className='h-4 w-4' />
                          <span className='hidden sm:inline'>Locations</span>
                        </TabsTrigger>
                      </TabsList>

                      {}
                      <TabsContent value='academic' className='pt-4'>
                        <AcademicTab form={form} />
                      </TabsContent>

                      {}
                      <TabsContent value='professional' className='pt-4'>
                        <ProfessionalTab
                          form={form}
                          accessToken={accessToken || ''}
                        />
                      </TabsContent>

                      {}
                      <TabsContent value='education' className='pt-4'>
                        <EducationTab form={form} />
                      </TabsContent>

                      {}
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

            {}
            <div className='bg-background/95 sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t px-6 py-4 shadow-lg backdrop-blur-sm'>
              {}
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

              {}
              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isUpdating || !onCancel}
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
      </Main>
    </>
  )
}
