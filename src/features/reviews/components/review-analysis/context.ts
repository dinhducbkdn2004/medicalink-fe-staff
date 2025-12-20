/**
 * Review Analysis Context
 * Shared state for review analysis management
 */
import { createContext } from 'react'
import type { ReviewAnalysisListItem } from '@/api/types'

type DialogType = 'create' | null

export interface ReviewAnalysisContextValue {
  // Dialog state
  openDialog: DialogType
  setOpen: (type: DialogType) => void

  // Current selection
  currentAnalysis: ReviewAnalysisListItem | null
  setCurrentAnalysis: (analysis: ReviewAnalysisListItem | null) => void

  // Doctor ID
  doctorId: string

  // Callbacks
  onAnalysisCreated?: () => void
}

export const ReviewAnalysisContext =
  createContext<ReviewAnalysisContextValue | null>(null)
