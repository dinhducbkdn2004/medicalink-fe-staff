import { createFileRoute } from '@tanstack/react-router'
import { DoctorReviewsPage } from '@/features/doctors/pages/doctor-reviews-page'

export const Route = createFileRoute('/_authenticated/reviews')({
  component: ReviewsRoute,
})

function ReviewsRoute() {
  return <DoctorReviewsPage />
}
