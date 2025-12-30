/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Specialty, type SpecialtyInfoSection } from '../data/schema'

type SpecialtiesDialogType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'view-info'
  | 'add-info'
  | 'edit-info'
  | 'delete-info'

type SpecialtiesContextType = {
  open: SpecialtiesDialogType | null
  setOpen: (str: SpecialtiesDialogType | null) => void
  currentRow: Specialty | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Specialty | null>>
  currentInfoSection: SpecialtyInfoSection | null
  setCurrentInfoSection: React.Dispatch<
    React.SetStateAction<SpecialtyInfoSection | null>
  >
}

const SpecialtiesContext = React.createContext<SpecialtiesContextType | null>(
  null
)

export function SpecialtiesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<SpecialtiesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Specialty | null>(null)
  const [currentInfoSection, setCurrentInfoSection] =
    useState<SpecialtyInfoSection | null>(null)

  return (
    <SpecialtiesContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        currentInfoSection,
        setCurrentInfoSection,
      }}
    >
      {children}
    </SpecialtiesContext>
  )
}

export const useSpecialties = () => {
  const specialtiesContext = React.useContext(SpecialtiesContext)

  if (!specialtiesContext) {
    throw new Error(
      'useSpecialties has to be used within <SpecialtiesProvider>'
    )
  }

  return specialtiesContext
}
