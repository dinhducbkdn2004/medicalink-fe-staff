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
          'Không tìm thấy email. Vui lòng bắt đầu lại quá trình đặt lại mật khẩu.'
        )
        return
      }

      await authService.requestPasswordReset({ email: resetEmail })
      toast.success('Một mã xác nhận mới đã được gửi đến email của bạn')
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
