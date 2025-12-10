import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { doctorService } from '@/api/services/doctor.service'
import { reviewService, type Review } from '@/api/services/review.service'
import type { PaginationParams } from '@/api/types/common.types'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReviewsDialogs } from '@/features/reviews/components/reviews-dialogs'
import { ReviewsProvider } from '@/features/reviews/components/reviews-provider'
import { ReviewsTable } from '@/features/reviews/components/reviews-table'

interface DoctorReviewsPageProps {
  // If doctorId is provided, it forces the view for that doctor (e.g. Admin view)
  doctorId?: string
}

export function DoctorReviewsPage({
  doctorId: initialDoctorId,
}: DoctorReviewsPageProps) {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { doctorId?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search: any = useSearch({ strict: false })
  const { user } = useAuthStore()

  // Determine target doctor ID: prop -> route param -> current user
  // If user is DOCTOR, we need to resolve their profileId first
  const [resolvedDoctorId, setResolvedDoctorId] = useState<string | undefined>(
    initialDoctorId || params.doctorId
  )

  useEffect(() => {
    const resolveId = async () => {
      // If we already have a specific ID from props or params, use it
      if (initialDoctorId || params.doctorId) {
        setResolvedDoctorId(initialDoctorId || params.doctorId)
        return
      }

      // If user is doctor, fetch their profile ID
      if (user?.role === 'DOCTOR' && user.id) {
        try {
          const doctorData = await doctorService.getProfileMe()
          if (doctorData.id) {
            setResolvedDoctorId(doctorData.id)
          }
        } catch (error) {
          console.error('Failed to resolve doctor profile ID:', error)
        }
      }
    }

    resolveId()
  }, [initialDoctorId, params.doctorId, user])

  const [data, setData] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageCount, setPageCount] = useState(0)

  // Derived pagination from search params
  const page = Number(search?.page) || 1
  const limit = Number(search?.limit) || 10

  // Fetch reviews logic
  const fetchReviews = useCallback(async () => {
    if (!resolvedDoctorId) return

    setIsLoading(true)
    try {
      const queryParams: PaginationParams = {
        page,
        limit,
        // Add other filters if needed
      }

      const response = await reviewService.getDoctorReviews(
        resolvedDoctorId,
        queryParams
      )
      setData(response.data)
      setPageCount(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }, [resolvedDoctorId, page, limit])

  useEffect(() => {
    if (resolvedDoctorId) {
      fetchReviews()
    }
  }, [fetchReviews, resolvedDoctorId])

  return (
    <ReviewsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Doctor Reviews
              </h2>
              <p className='text-muted-foreground'>
                Manage and view reviews for this account.
              </p>
            </div>
          </div>
          <ReviewsTable
            data={data}
            pageCount={pageCount}
            search={search}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigate={navigate as any}
            isLoading={isLoading}
          />
        </div>
      </Main>
      <ReviewsDialogs />
    </ReviewsProvider>
  )
}
