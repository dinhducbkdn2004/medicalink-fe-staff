import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Tạo tài khoản
          </CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để tạo tài khoản. <br />
            Đã có tài khoản?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Đăng nhập
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Bằng cách tạo tài khoản, bạn đồng ý với{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Điều khoản Dịch vụ
            </a>{' '}
            và{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Chính sách Bảo mật
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
