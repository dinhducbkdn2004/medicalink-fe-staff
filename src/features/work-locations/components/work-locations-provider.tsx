/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type WorkLocation } from '../data/schema'

type WorkLocationsDialogType = 'add' | 'edit' | 'delete'

type WorkLocationsContextType = {
  open: WorkLocationsDialogType | null
  setOpen: (str: WorkLocationsDialogType | null) => void
  currentRow: WorkLocation | null
  setCurrentRow: React.Dispatch<React.SetStateAction<WorkLocation | null>>
}

const WorkLocationsContext =
  React.createContext<WorkLocationsContextType | null>(null)

export function WorkLocationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<WorkLocationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<WorkLocation | null>(null)

  return (
    <WorkLocationsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </WorkLocationsContext>
  )
}

export const useWorkLocations = () => {
  const workLocationsContext = React.useContext(WorkLocationsContext)

  if (!workLocationsContext) {
    throw new Error(
      'useWorkLocations has to be used within <WorkLocationsProvider>'
    )
  }

  return workLocationsContext
}
