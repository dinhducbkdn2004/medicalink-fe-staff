import { Button } from '@/components/ui/button'

export function MaintenanceError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>Trang web đang được bảo trì!</span>
        <p className='text-muted-foreground text-center'>
          Trang web hiện không có sẵn. <br />
          Chúng tôi sẽ trực tuyến trở lại sớm nhất có thể.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>Tìm hiểu thêm</Button>
        </div>
      </div>
    </div>
  )
}
