import { createContext } from 'react'
import type { PermissionGroup } from '@/api/types/permission.types'

type DialogType = 'create' | 'edit' | 'delete' | 'permissions' | null

export type GroupManagerContextType = {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentGroup: PermissionGroup | null
  setCurrentGroup: (group: PermissionGroup | null) => void
}

export const GroupManagerContext = createContext<
  GroupManagerContextType | undefined
>(undefined)
