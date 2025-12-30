/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Patient, PatientDialogType } from '../types'

type PatientsContextType = {
  open: PatientDialogType
  setOpen: (str: PatientDialogType) => void
  currentRow: Patient | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Patient | null>>
}

const PatientsContext = React.createContext<PatientsContextType | null>(null)

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<Exclude<PatientDialogType, null>>(null)
  const [currentRow, setCurrentRow] = useState<Patient | null>(null)

  return (
    <PatientsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PatientsContext>
  )
}

export const usePatients = () => {
  const patientsContext = React.useContext(PatientsContext)

  if (!patientsContext) {
    throw new Error('usePatients has to be used within <PatientsProvider>')
  }

  return patientsContext
}
