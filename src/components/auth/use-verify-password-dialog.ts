import { useState } from 'react'

/**
 * Hook to manage verify password dialog state
 * Returns state and handlers for the dialog
 */
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
