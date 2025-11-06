/**
 * Group Manager Provider
 * Context provider for managing group state and dialogs
 */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { PermissionGroup } from '@/api/types/permission.types'

type DialogType = 'create' | 'edit' | 'delete' | 'permissions' | null

type GroupManagerContextType = {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentGroup: PermissionGroup | null
  setCurrentGroup: (group: PermissionGroup | null) => void
}

const GroupManagerContext = createContext<GroupManagerContextType | undefined>(
  undefined
)

export function GroupManagerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentGroup, setCurrentGroup] = useState<PermissionGroup | null>(null)

  return (
    <GroupManagerContext.Provider
      value={{
        open,
        setOpen,
        currentGroup,
        setCurrentGroup,
      }}
    >
      {children}
    </GroupManagerContext.Provider>
  )
}

export function useGroupManager() {
  const context = useContext(GroupManagerContext)
  if (context === undefined) {
    throw new Error(
      'useGroupManager must be used within a GroupManagerProvider'
    )
  }
  return context
}
