import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function UnauthorisedError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Truy cập không hợp lệ</span>
        <p className='text-muted-foreground text-center'>
          Vui lòng đăng nhập với thông tin xác thực phù hợp <br /> để truy cập tài nguyên này.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Quay lại
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  )
}
