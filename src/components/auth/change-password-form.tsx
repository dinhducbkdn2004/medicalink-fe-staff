/**
 * Change Password Form Component
 * Allows authenticated users to change their password
 */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock } from 'lucide-react'
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/api/types/auth.types'
import { useChangePassword } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  showCard?: boolean
}

export function ChangePasswordForm({
  onSuccess,
  showCard = true,
}: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePassword()

  const form = useForm<ChangePasswordFormData>({
    // @ts-expect-error - Zod v4 compatibility issue with @hookform/resolvers
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: ChangePasswordFormData) {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      // Reset form on success
      form.reset()

      // Call optional success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      // Error handling is done in the hook and API client
      console.error('Change password failed:', error)
    }
  }

  const isLoading = changePasswordMutation.isPending

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter your current password'
                  autoComplete='current-password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter your new password'
                  autoComplete='new-password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters and contain uppercase, lowercase,
                and a number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Confirm your new password'
                  autoComplete='new-password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isLoading} className='w-full'>
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Lock className='h-4 w-4' />
          )}
          Change password
        </Button>
      </form>
    </Form>
  )

  if (!showCard) {
    return formContent
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  )
}
