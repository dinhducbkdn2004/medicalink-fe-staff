/**
 * Questions Provider
 * Context provider for managing questions state
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Question, Answer } from '../data/schema'
import { QuestionsContext } from './questions-context'

export type { QuestionsContextValue } from './questions-context'

// ============================================================================
// Types
// ============================================================================

type DialogType = 'view' | 'edit' | 'delete' | 'answer' | 'close' | 'answers'

// ============================================================================
// Provider
// ============================================================================

interface QuestionsProviderProps {
  children: ReactNode
}

export function QuestionsProvider({
  children,
}: Readonly<QuestionsProviderProps>) {
  const [openDialogs, setOpenDialogs] = useState<Record<DialogType, boolean>>({
    view: false,
    edit: false,
    delete: false,
    answer: false,
    close: false,
    answers: false,
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)

  const setOpen = useCallback((type: DialogType, isOpen?: boolean) => {
    setOpenDialogs((prev) => ({
      ...prev,
      [type]: isOpen ?? !prev[type],
    }))
  }, [])

  const closeAll = useCallback(() => {
    setOpenDialogs({
      view: false,
      edit: false,
      delete: false,
      answer: false,
      close: false,
      answers: false,
    })
  }, [])

  const value = useMemo(
    () => ({
      open: openDialogs,
      setOpen,
      closeAll,
      currentQuestion,
      setCurrentQuestion,
      currentAnswer,
      setCurrentAnswer,
    }),
    [openDialogs, setOpen, closeAll, currentQuestion, currentAnswer]
  )

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  )
}
