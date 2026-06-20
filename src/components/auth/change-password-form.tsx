
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

      
      form.reset()

      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      
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
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Nhập mật khẩu hiện tại'
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
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Nhập mật khẩu mới'
                  autoComplete='new-password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
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
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Xác nhận mật khẩu mới của bạn'
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
          Đổi mật khẩu
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
        <CardTitle>Đổi mật khẩu</CardTitle>
        <CardDescription>
          Cập nhật mật khẩu để bảo mật tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  )
}
