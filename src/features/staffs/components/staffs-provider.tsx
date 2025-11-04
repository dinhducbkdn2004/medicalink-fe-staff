import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Staff } from '../data/schema'

type StaffsDialogType = 'add' | 'edit' | 'delete'

type StaffsContextType = {
  open: StaffsDialogType | null
  setOpen: (str: StaffsDialogType | null) => void
  currentRow: Staff | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Staff | null>>
}

const StaffsContext = React.createContext<StaffsContextType | null>(null)

export function StaffsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StaffsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Staff | null>(null)

  return (
    <StaffsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StaffsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStaffs = () => {
  const staffsContext = React.useContext(StaffsContext)

  if (!staffsContext) {
    throw new Error('useStaffs has to be used within <StaffsProvider>')
  }

  return staffsContext
}


