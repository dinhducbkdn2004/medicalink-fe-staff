import { useState } from 'react'
import { toast } from 'sonner'
import { authService } from '@/api/services/auth.service'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  const [isResending, setIsResending] = useState(false)

  const handleResendCode = async () => {
    try {
      setIsResending(true)
      // Get email from localStorage (saved during forgot password flow)
      const email = localStorage.getItem('reset_email')
      if (!email) {
        toast.error(
          'Email not found. Please start the password reset process again.'
        )
        return
      }

      await authService.requestPasswordReset({ email })
      toast.success('A new verification code has been sent to your email')
    } catch (error) {
      // Error already handled by API interceptor
      console.error('Resend code error:', error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Two-factor Authentication
          </CardTitle>
          <CardDescription>
            Please enter the authentication code. <br /> We have sent the
            authentication code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Haven't received it?{' '}
            <Button
              variant='link'
              className='h-auto p-0 text-sm underline underline-offset-4'
              onClick={handleResendCode}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend a new code.'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
