/**
 * Reviews Provider
 * Context provider for reviews management state
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Review } from '../data/schema'
import { ReviewsContext } from './reviews-context'

export type { ReviewsContextValue } from './reviews-context'

// ============================================================================
// Types
// ============================================================================

type DialogType = 'view' | 'approve' | 'reject' | 'delete' | null

// ============================================================================
// Provider Component
// ============================================================================

interface ReviewsProviderProps {
  children: ReactNode
}

export function ReviewsProvider({ children }: Readonly<ReviewsProviderProps>) {
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
