/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { DoctorWithProfile } from '../types'

type DoctorsDialogType = 'create' | 'edit' | 'delete' | 'toggleActive' | 'stats'

type DoctorsContextType = {
  open: DoctorsDialogType | null
  setOpen: (str: DoctorsDialogType | null) => void
  currentRow: DoctorWithProfile | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DoctorWithProfile | null>>
}

const DoctorsContext = React.createContext<DoctorsContextType | null>(null)

export function DoctorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DoctorsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DoctorWithProfile | null>(null)

  return (
    <DoctorsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DoctorsContext>
  )
}

export const useDoctors = () => {
  const doctorsContext = React.useContext(DoctorsContext)

  if (!doctorsContext) {
    throw new Error('useDoctors has to be used within <DoctorsProvider>')
  }

  return doctorsContext
}
