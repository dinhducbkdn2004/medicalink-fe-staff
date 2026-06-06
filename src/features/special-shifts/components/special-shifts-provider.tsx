import { createContext, useContext, useState } from 'react'
import { type SpecialShift } from '../data/schema'

type DialogType = 'create' | 'update' | 'delete' | null

interface SpecialShiftsContextType {
  open: DialogType
  setOpen: (str: DialogType) => void
  currentRow: SpecialShift | null
  setCurrentRow: (row: SpecialShift | null) => void
}

const SpecialShiftsContext = createContext<SpecialShiftsContextType | null>(null)

export function SpecialShiftsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<SpecialShift | null>(null)

  return (
    <SpecialShiftsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SpecialShiftsContext.Provider>
  )
}

export function useSpecialShiftsContext() {
  const context = useContext(SpecialShiftsContext)
  if (!context) {
    throw new Error('useSpecialShiftsContext must be used within <SpecialShiftsProvider>')
  }
  return context
}
