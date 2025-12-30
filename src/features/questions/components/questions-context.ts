import { createContext } from 'react'
import type { Question, Answer } from '../data/schema'

type DialogType = 'view' | 'edit' | 'delete' | 'answer' | 'close' | 'answers'

export interface QuestionsContextValue {
  open: Record<DialogType, boolean>
  setOpen: (type: DialogType, isOpen?: boolean) => void
  closeAll: () => void

  currentQuestion: Question | null
  setCurrentQuestion: (question: Question | null) => void

  currentAnswer: Answer | null
  setCurrentAnswer: (answer: Answer | null) => void
}

export const QuestionsContext = createContext<
  QuestionsContextValue | undefined
>(undefined)
