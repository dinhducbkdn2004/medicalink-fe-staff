import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { doctorProfileService } from '@/api/services/doctor-profile.service'
import { reviewService, type Review } from '@/api/services/review.service'
import type { PaginationParams } from '@/api/types/common.types'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReviewsDialogs } from '@/features/reviews/components/reviews-dialogs'
import { ReviewsProvider } from '@/features/reviews/components/reviews-provider'
import { ReviewsTable } from '@/features/reviews/components/reviews-table'

interface DoctorReviewsPageProps {
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

  const [resolvedStaffAccountId, setResolvedStaffAccountId] = useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    const resolveStaffAccountId = async () => {
      if (
        !initialDoctorId &&
        !params.doctorId &&
        user?.role === 'DOCTOR' &&
        user.id
      ) {
        setResolvedStaffAccountId(user.id)
        return
      }

      const profileId = initialDoctorId || params.doctorId
      if (profileId) {
        try {
          const profile =
            await doctorProfileService.getDoctorProfileById(profileId)
          if (profile.staffAccountId) {
            setResolvedStaffAccountId(profile.staffAccountId)
          }
        } catch (error) {
          console.error('Failed to resolve staff account ID:', error)
        }
      }
    }

    resolveStaffAccountId()
  }, [initialDoctorId, params.doctorId, user])

  const [data, setData] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageCount, setPageCount] = useState(0)

  const page = Number(search?.page) || 1
  const limit = Number(search?.limit) || 10
  const isPublic = search?.isPublic ? search.isPublic === 'true' : undefined

  const fetchReviews = useCallback(async () => {
    if (!resolvedStaffAccountId) return

    setIsLoading(true)
    try {
      const queryParams: PaginationParams & { isPublic?: boolean } = {
        page,
        limit,
      }

      if (isPublic !== undefined) {
        queryParams.isPublic = isPublic
      }

      const response = await reviewService.getDoctorReviews(
        resolvedStaffAccountId,
        queryParams
      )
      setData(response.data)
      setPageCount(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }, [resolvedStaffAccountId, page, limit, isPublic])

  useEffect(() => {
    if (resolvedStaffAccountId) {
      fetchReviews()
    }
  }, [fetchReviews, resolvedStaffAccountId])

  return (
    <ReviewsProvider onReviewDeleted={fetchReviews}>
      <Header fixed>
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
