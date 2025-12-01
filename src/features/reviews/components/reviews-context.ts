import { createContext } from 'react'
import type { Review } from '../data/schema'

type DialogType = 'view' | 'approve' | 'reject' | 'delete' | null

export interface ReviewsContextValue {
  // Dialog state
  openDialog: DialogType
  setOpen: (type: DialogType) => void
  currentReview: Review | null
  setCurrentReview: (review: Review | null) => void
}

export const ReviewsContext = createContext<ReviewsContextValue | null>(null)
