import { format } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { formatRole, getGenderDisplay } from '@/lib/auth-utils'
import { Badge } from '@/components/ui/badge'


export function ProfileForm() {
  const { user, profile } = useAuth()
  const currentUser = profile || user

  if (!currentUser) {
    return (
      <div className='py-6'>
        <p className='text-muted-foreground text-sm'>
          Đang tải thông tin hồ sơ...
        </p>
      </div>
    )
  }

  return (
      <div className='space-y-4'>
        <h4 className='text-sm font-medium'>Thông tin bổ sung</h4>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Vai trò</p>
            <Badge variant='secondary'>{formatRole(currentUser.role)}</Badge>
          </div>

          {currentUser.phone && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Số điện thoại</p>
              <p className='text-sm'>{currentUser.phone}</p>
            </div>
          )}

          {currentUser.dateOfBirth && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Ngày sinh</p>
              <p className='text-sm'>
                {format(new Date(currentUser.dateOfBirth), 'PPP')}
              </p>
            </div>
          )}

          {currentUser.isMale !== undefined && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Giới tính</p>
              <p className='text-sm'>{getGenderDisplay(currentUser.isMale)}</p>
            </div>
          )}

          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Tài khoản được tạo</p>
            <p className='text-sm'>
              {format(new Date(currentUser.createdAt), 'PPP')}
            </p>
          </div>

          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Cập nhật lần cuối</p>
            <p className='text-sm'>
              {format(new Date(currentUser.updatedAt), 'PPP')}
            </p>
          </div>
        </div>
      </div>
  )
}
