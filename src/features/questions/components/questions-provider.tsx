/**
 * Questions Provider
 * Context provider for managing questions state
 */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Question, Answer } from '../data/schema'

// ============================================================================
// Types
// ============================================================================

type DialogType =
  | 'view'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'viewAnswers'

interface QuestionsContextValue {
  // Dialog state
  open: Record<DialogType, boolean>
  setOpen: (type: DialogType) => void
  closeAll: () => void

  // Selected items
  currentQuestion: Question | null
  setCurrentQuestion: (question: Question | null) => void

  currentAnswer: Answer | null
  setCurrentAnswer: (answer: Answer | null) => void
}

// ============================================================================
// Context
// ============================================================================

const QuestionsContext = createContext<QuestionsContextValue | undefined>(
  undefined
)

// ============================================================================
// Provider
// ============================================================================

interface QuestionsProviderProps {
  children: ReactNode
}

export function QuestionsProvider({ children }: QuestionsProviderProps) {
  const [openDialogs, setOpenDialogs] = useState<Record<DialogType, boolean>>({
    view: false,
    edit: false,
    delete: false,
    approve: false,
    reject: false,
    viewAnswers: false,
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)

  const setOpen = (type: DialogType) => {
    setOpenDialogs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const closeAll = () => {
    setOpenDialogs({
      view: false,
      edit: false,
      delete: false,
      approve: false,
      reject: false,
      viewAnswers: false,
    })
  }

  return (
    <QuestionsContext.Provider
      value={{
        open: openDialogs,
        setOpen,
        closeAll,
        currentQuestion,
        setCurrentQuestion,
        currentAnswer,
        setCurrentAnswer,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (!context) {
    throw new Error('useQuestions must be used within QuestionsProvider')
  }
  return context
}

