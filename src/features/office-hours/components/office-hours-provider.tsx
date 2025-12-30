/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type OfficeHour } from '../data/schema'

type OfficeHoursDialogType = 'add' | 'delete'

type OfficeHoursContextType = {
  open: OfficeHoursDialogType | null
  setOpen: (str: OfficeHoursDialogType | null) => void
  currentRow: OfficeHour | null
  setCurrentRow: React.Dispatch<React.SetStateAction<OfficeHour | null>>
}

const OfficeHoursContext = React.createContext<OfficeHoursContextType | null>(
  null
)

export function OfficeHoursProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useDialogState<OfficeHoursDialogType>(null)
  const [currentRow, setCurrentRow] = useState<OfficeHour | null>(null)

  const value = useMemo(
    () => ({
      open,
      setOpen,
      currentRow,
      setCurrentRow,
    }),
    [open, setOpen, currentRow, setCurrentRow]
  )

  return (
    <OfficeHoursContext.Provider value={value}>
      {children}
    </OfficeHoursContext.Provider>
  )
}

export const useOfficeHoursContext = () => {
  const officeHoursContext = React.useContext(OfficeHoursContext)

  if (!officeHoursContext) {
    throw new Error(
      'useOfficeHoursContext has to be used within <OfficeHoursProvider>'
    )
  }

  return officeHoursContext
}
