import { useState } from 'react'

export function useVerifyPasswordDialog(onVerified: () => void) {
  const [open, setOpen] = useState(false)

  return {
    open,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
    setOpen,
    onVerified: () => {
      setOpen(false)
      onVerified()
    },
  }
}
