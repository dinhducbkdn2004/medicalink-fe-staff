import { createContext } from 'react'
import type { ReviewAnalysisListItem } from '@/api/types'

type DialogType = 'create' | null

export interface ReviewAnalysisContextValue {
  openDialog: DialogType
  setOpen: (type: DialogType) => void

  currentAnalysis: ReviewAnalysisListItem | null
  setCurrentAnalysis: (analysis: ReviewAnalysisListItem | null) => void

  doctorId: string

  onAnalysisCreated?: () => void
}

export const ReviewAnalysisContext =
  createContext<ReviewAnalysisContextValue | null>(null)
