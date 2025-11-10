/**
 * Reviews Management Page
 * Main page for managing doctor reviews
 */
import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReviewsDialogs } from './components/reviews-dialogs'
import { ReviewsPrimaryButtons } from './components/reviews-primary-buttons'
import { ReviewsProvider } from './components/reviews-provider'
import { ReviewsTable } from './components/reviews-table'
import type { ReviewQueryParams } from './data/schema'
import { useReviews as useReviewsData } from './data/use-reviews'

// ============================================================================
// Component
// ============================================================================

function ReviewsContent() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/reviews/' })

  // Build query params
  const queryParams = useMemo<ReviewQueryParams>(() => {
    const params: ReviewQueryParams = {
      page: search.page || 1,
      limit: search.pageSize || 10,
    }

    if (search.search) params.search = search.search
    if (search.status) params.status = search.status
    if (search.rating) params.rating = Number(search.rating)
    if (search.sortBy && search.sortOrder) {
      params.sortBy = search.sortBy
      params.sortOrder = search.sortOrder
    }

    return params
  }, [search])

  // Fetch reviews
  const { data, isLoading, refetch, isFetching } = useReviewsData(queryParams)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center gap-2'>
          <ReviewsPrimaryButtons
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />
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
          search={search}
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
    <ReviewsProvider>
      <ReviewsContent />
    </ReviewsProvider>
  )
}

