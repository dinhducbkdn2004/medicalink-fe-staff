
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Review } from '../data/schema'
import { ReviewsContext } from './reviews-context'

export type { ReviewsContextValue } from './reviews-context'





type DialogType = 'view' | 'approve' | 'reject' | 'delete' | null





interface ReviewsProviderProps {
  children: ReactNode
  onReviewDeleted?: () => void
}

export function ReviewsProvider({
  children,
  onReviewDeleted,
}: Readonly<ReviewsProviderProps>) {
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
      onReviewDeleted,
    }),
    [openDialog, setOpen, currentReview, onReviewDeleted]
  )

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  )
}
