
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
} from './components/review-analysis'





function ReviewAnalysesContent() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/reviews' })
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

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <Button
              variant='ghost'
              size='sm'
              className='mb-2'
              onClick={handleBack}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Reviews
            </Button>
            <h2 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <Sparkles className='text-primary h-6 w-6' />
              Review Analyses
            </h2>
            <p className='text-muted-foreground'>
              AI-powered insights and analysis of doctor reviews
            </p>
          </div>
        </div>

        {}
        <div className='grid flex-1 grid-cols-1 gap-4 overflow-hidden sm:gap-6 lg:grid-cols-3'>
          {}
          <AnalysisList className='max-h-[calc(100vh-16rem)] overflow-hidden lg:col-span-1' />

          {}
          <AnalysisDetailView className='max-h-[calc(100vh-16rem)] overflow-y-auto lg:col-span-2' />
        </div>
      </Main>

      {}
      <CreateAnalysisDialog />
    </>
  )
}





export function ReviewAnalyses() {
  const { doctorId } = useParams({
    from: '/_authenticated/reviews/$doctorId/analyses',
  })

  return (
    <RequirePermission resource='reviews' action='read'>
      <ReviewAnalysisProvider doctorId={doctorId}>
        <ReviewAnalysesContent />
      </ReviewAnalysisProvider>
    </RequirePermission>
  )
}
