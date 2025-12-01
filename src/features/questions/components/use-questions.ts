import { useContext } from 'react'
import {
  QuestionsContext,
  type QuestionsContextValue,
} from './questions-context'

export function useQuestions(): QuestionsContextValue {
  const context = useContext(QuestionsContext)
  if (!context) {
    throw new Error('useQuestions must be used within QuestionsProvider')
  }
  return context
}
