/**
 * Review Analysis Provider
 * Context provider for review analysis state management
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { ReviewAnalysisListItem } from '@/api/types'
import { ReviewAnalysisContext } from './context'

export type { ReviewAnalysisContextValue } from './context'

// ============================================================================
// Types
// ============================================================================

type DialogType = 'create' | null

// ============================================================================
// Provider Component
// ============================================================================

interface ReviewAnalysisProviderProps {
  children: ReactNode
  doctorId: string
  onAnalysisCreated?: () => void
}

export function ReviewAnalysisProvider({
  children,
  doctorId,
  onAnalysisCreated,
}: Readonly<ReviewAnalysisProviderProps>) {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [currentAnalysis, setCurrentAnalysis] =
    useState<ReviewAnalysisListItem | null>(null)

  const setOpen = useCallback((type: DialogType) => {
    setOpenDialog(type)
  }, [])

  const value = useMemo(
    () => ({
      openDialog,
      setOpen,
      currentAnalysis,
      setCurrentAnalysis,
      doctorId,
      onAnalysisCreated,
    }),
    [openDialog, setOpen, currentAnalysis, doctorId, onAnalysisCreated]
  )

  return (
    <ReviewAnalysisContext.Provider value={value}>
      {children}
    </ReviewAnalysisContext.Provider>
  )
}
