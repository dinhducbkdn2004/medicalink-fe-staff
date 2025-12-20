import { useNavigate, useParams } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  ReviewAnalysisProvider,
  AnalysisList,
  AnalysisDetailView,
  CreateAnalysisDialog,
} from '@/features/reviews/components/review-analysis'
import { DoctorStatsOverview } from '../components/doctor-stats-overview'

function DoctorStatsContent() {
  const _navigate = useNavigate()
  const { doctorId } = useParams({
    from: '/_authenticated/doctors/$doctorId/stats',
  })

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

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Doctor Statistics & Insights
            </h1>
            <p className='text-muted-foreground text-sm'>
              Comprehensive analytics and AI-powered review insights
            </p>
          </div>
        </div>

        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full max-w-md grid-cols-2'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='ai-analysis'>AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-4'>
            <DoctorStatsOverview doctorId={doctorId} />
          </TabsContent>

          <TabsContent value='ai-analysis' className='mt-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]'>
              <AnalysisList className='lg:col-span-1' />

              <AnalysisDetailView className='lg:col-span-1' />
            </div>
          </TabsContent>
        </Tabs>
      </Main>

      {/* Dialogs */}
      <CreateAnalysisDialog />
    </>
  )
}

// ============================================================================
// Export
// ============================================================================

export function DoctorStatsPage() {
  const { doctorId } = useParams({
    from: '/_authenticated/doctors/$doctorId/stats',
  })

  return (
    <RequirePermission resource='doctors' action='read'>
      <ReviewAnalysisProvider doctorId={doctorId}>
        <DoctorStatsContent />
      </ReviewAnalysisProvider>
    </RequirePermission>
  )
}
