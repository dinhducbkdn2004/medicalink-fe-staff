/**
 * Reviews Provider
 * Context provider for reviews management state
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Review } from '../data/schema'

// ============================================================================
// Types
// ============================================================================

type DialogType = 'view' | 'approve' | 'reject' | 'delete' | null

interface ReviewsContextValue {
  // Dialog state
  openDialog: DialogType
  setOpen: (type: DialogType) => void
  currentReview: Review | null
  setCurrentReview: (review: Review | null) => void
}

// ============================================================================
// Context
// ============================================================================

const ReviewsContext = createContext<ReviewsContextValue | null>(null)

// ============================================================================
// Provider Component
// ============================================================================

interface ReviewsProviderProps {
  children: ReactNode
}

export function ReviewsProvider({ children }: ReviewsProviderProps) {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [currentReview, setCurrentReview] = useState<Review | null>(null)

  const setOpen = useCallback((type: DialogType) => {
    setOpenDialog(type)
  }, [])

  const value = useMemo(
    () => ({
      openDialog,
      setOpen,
      currentReview,
      setCurrentReview,
    }),
    [openDialog, setOpen, currentReview]
  )

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error('useReviews must be used within ReviewsProvider')
  }
  return context
}

