import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Rất tiếc! Không tìm thấy trang!</span>
        <p className='text-muted-foreground text-center'>
          Có vẻ như trang bạn đang tìm kiếm <br />
          không tồn tại hoặc đã bị xóa.
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
