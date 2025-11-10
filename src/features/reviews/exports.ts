/**
 * Reviews Feature - Exports
 * Central export point for reviews feature
 */

// Main page
export { Reviews } from './index'

// Components
export { ReviewsTable } from './components/reviews-table'
export { ReviewsProvider, useReviews } from './components/reviews-provider'
export { ReviewsDialogs } from './components/reviews-dialogs'
export { ReviewsPrimaryButtons } from './components/reviews-primary-buttons'

// Data hooks
export {
  useReviews as useReviewsData,
  useDoctorReviews,
  useReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  reviewKeys,
} from './data/use-reviews'

// Types
export type {
  Review,
  ReviewQueryParams,
  CreateReviewRequest,
  ReviewListResponse,
  DoctorReviewsResponse,
  ReviewSummary,
} from './data/schema'
