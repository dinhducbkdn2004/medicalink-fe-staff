import { createFileRoute } from '@tanstack/react-router'
import { ReviewAnalyses } from '@/features/reviews/review-analyses'

export const Route = createFileRoute(
  '/_authenticated/reviews/$doctorId/analyses'
)({
  component: ReviewAnalysesRoute,
})

function ReviewAnalysesRoute() {
  return <ReviewAnalyses />
}
