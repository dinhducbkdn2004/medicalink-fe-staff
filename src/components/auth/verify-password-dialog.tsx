/**
 * Verify Password Dialog Component
 * Modal dialog for password verification before sensitive operations
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldCheck } from 'lucide-react'
import {
  verifyPasswordSchema,
  type VerifyPasswordFormData,
} from '@/api/types/auth.types'
import { useVerifyPassword } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

interface VerifyPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: () => void
  title?: string
  description?: string
}

export function VerifyPasswordDialog({
  open,
  onOpenChange,
  onVerified,
  title = 'Verify your password',
  description = 'Please enter your password to confirm this action.',
}: VerifyPasswordDialogProps) {
  const verifyPasswordMutation = useVerifyPassword()

  const form = useForm<VerifyPasswordFormData>({
    resolver: zodResolver(verifyPasswordSchema) as never,
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(data: VerifyPasswordFormData) {
    try {
      await verifyPasswordMutation.mutateAsync(data)

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)

      // Call success callback
      onVerified()
    } catch (error) {
      // Error handling is done in the hook and API client
      console.error('Password verification failed:', error)
    }
  }

  // Reset form when dialog closes
  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  const isLoading = verifyPasswordMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ShieldCheck className='h-5 w-5' />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Enter your password'
                      autoComplete='current-password'
                      autoFocus
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
                Verify
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

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

