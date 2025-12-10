import { createFileRoute } from '@tanstack/react-router'
import { DoctorReviewsPage } from '@/features/doctors/pages/doctor-reviews-page'

export const Route = createFileRoute(
  '/_authenticated/doctors/$doctorId/reviews'
)({
  component: DoctorReviewsAdminRoute,
})

function DoctorReviewsAdminRoute() {
  const { doctorId } = Route.useParams()
  return <DoctorReviewsPage doctorId={doctorId} />
}
