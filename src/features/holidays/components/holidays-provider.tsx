import { createContext, useContext, useState } from 'react'
import { type ClinicException } from '../data/schema'

type DialogType = 'create' | 'update' | 'delete' | null

interface HolidaysContextType {
  open: DialogType
  setOpen: (str: DialogType) => void
  currentRow: ClinicException | null
  setCurrentRow: (row: ClinicException | null) => void
}

const HolidaysContext = createContext<HolidaysContextType | null>(null)

export function HolidaysProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<ClinicException | null>(null)

  return (
    <HolidaysContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </HolidaysContext.Provider>
  )
}

export function useHolidaysContext() {
  const context = useContext(HolidaysContext)
  if (!context) {
    throw new Error('useHolidaysContext must be used within <HolidaysProvider>')
  }
  return context
}
