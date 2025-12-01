import { useContext } from 'react'
import {
  GroupManagerContext,
  type GroupManagerContextType,
} from './group-manager-context'

export function useGroupManager(): GroupManagerContextType {
  const context = useContext(GroupManagerContext)
  if (context === undefined) {
    throw new Error(
      'useGroupManager must be used within a GroupManagerProvider'
    )
  }
  return context
}
