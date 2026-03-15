import { useState } from 'react'
import { toast } from 'sonner'
import { authService } from '@/api/services/auth.service'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  const [isResending, setIsResending] = useState(false)
  const email = localStorage.getItem('reset_email') || ''

  const handleResendCode = async () => {
    try {
      setIsResending(true)

      const resetEmail = localStorage.getItem('reset_email')
      if (!resetEmail) {
        toast.error(
          'Email not found. Please start the password reset process again.'
        )
        return
      }

      await authService.requestPasswordReset({ email: resetEmail })
      toast.success('A new verification code has been sent to your email')
    } catch (error) {
      console.error('Resend code error:', error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <OtpForm
        email={email}
        onResendCode={handleResendCode}
        isResending={isResending}
      />
    </AuthLayout>
  )
}
