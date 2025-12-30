import { useContext } from 'react'
import {
  ReviewAnalysisContext,
  type ReviewAnalysisContextValue,
} from './context'

export function useReviewAnalysis(): ReviewAnalysisContextValue {
  const context = useContext(ReviewAnalysisContext)
  if (!context) {
    throw new Error(
      'useReviewAnalysis must be used within ReviewAnalysisProvider'
    )
  }
  return context
}
