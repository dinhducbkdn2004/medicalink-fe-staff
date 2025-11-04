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
          Loading profile information...
        </p>
      </div>
    )
  }

  return (
      <div className='space-y-4'>
        <h4 className='text-sm font-medium'>Additional information</h4>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Role</p>
            <Badge variant='secondary'>{formatRole(currentUser.role)}</Badge>
          </div>

          {currentUser.phone && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Phone</p>
              <p className='text-sm'>{currentUser.phone}</p>
            </div>
          )}

          {currentUser.dateOfBirth && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Date of birth</p>
              <p className='text-sm'>
                {format(new Date(currentUser.dateOfBirth), 'PPP')}
              </p>
            </div>
          )}

          {currentUser.isMale !== undefined && (
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>Gender</p>
              <p className='text-sm'>{getGenderDisplay(currentUser.isMale)}</p>
            </div>
          )}

          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Account created</p>
            <p className='text-sm'>
              {format(new Date(currentUser.createdAt), 'PPP')}
            </p>
          </div>

          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>Last updated</p>
            <p className='text-sm'>
              {format(new Date(currentUser.updatedAt), 'PPP')}
            </p>
          </div>
        </div>
      </div>
  )
}
