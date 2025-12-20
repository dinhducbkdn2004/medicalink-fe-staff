/**
 * Reviews Management Page
 * Main page for managing doctor reviews
 */
import { useNavigate } from '@tanstack/react-router'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReviewsDialogs } from './components/reviews-dialogs'
import { ReviewsProvider } from './components/reviews-provider'
import { ReviewsTable } from './components/reviews-table'
import { useReviews as useReviewsData } from './data/use-reviews'

// ============================================================================
// Component
// ============================================================================

function ReviewsContent() {
  const navigate = useNavigate()

  // Fetch reviews
  const { data, isLoading } = useReviewsData({})

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
            <h2 className='text-2xl font-bold tracking-tight'>
              Doctor Reviews
            </h2>
            <p className='text-muted-foreground'>
              Manage patient reviews and feedback for doctors
            </p>
          </div>
        </div>
        <ReviewsTable
          data={data?.data || []}
          pageCount={data?.meta?.totalPages || 0}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>

      <ReviewsDialogs />
    </>
  )
}

// ============================================================================
// Export
// ============================================================================

export function Reviews() {
  return (
    <RequirePermission resource='reviews' action='read'>
      <ReviewsProvider>
        <ReviewsContent />
      </ReviewsProvider>
    </RequirePermission>
  )
}
