/**
 * Group Manager Provider
 * Context provider for managing group state and dialogs
 */
import { useMemo, useState, type ReactNode } from 'react'
import type { PermissionGroup } from '@/api/types/permission.types'
import { GroupManagerContext } from './group-manager-context'

export type { GroupManagerContextType } from './group-manager-context'

type DialogType = 'create' | 'edit' | 'delete' | 'permissions' | null

export function GroupManagerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentGroup, setCurrentGroup] = useState<PermissionGroup | null>(null)

  const value = useMemo(
    () => ({
      open,
      setOpen,
      currentGroup,
      setCurrentGroup,
    }),
    [open, currentGroup]
  )

  return (
    <GroupManagerContext.Provider value={value}>
      {children}
    </GroupManagerContext.Provider>
  )
}
