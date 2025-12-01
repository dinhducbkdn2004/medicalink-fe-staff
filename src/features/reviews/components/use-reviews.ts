import { useContext } from 'react'
import { ReviewsContext, type ReviewsContextValue } from './reviews-context'

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error('useReviews must be used within ReviewsProvider')
  }
  return context
}
