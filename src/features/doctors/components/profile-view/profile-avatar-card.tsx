/**
 * ProfileAvatarCard Component
 * Displays doctor avatar, name, degree, and contact information
 */
import { User, Mail, Phone } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { CompleteDoctorData } from '@/api/types/doctor.types'

interface ProfileAvatarCardProps {
  doctor: CompleteDoctorData
}

function EmptyField({ text = 'No information provided' }: { text?: string }) {
  return (
    <div className='text-muted-foreground flex items-center gap-2 text-xs italic'>
      <span>-</span>
      <span>{text}</span>
    </div>
  )
}

export function ProfileAvatarCard({ doctor }: ProfileAvatarCardProps) {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col items-center text-center'>
          {/* Avatar with Image Preview */}
          {doctor?.avatarUrl ? (
            <div className='relative'>
              <img
                src={doctor.avatarUrl}
                alt={doctor?.fullName}
                className='ring-border h-32 w-32 rounded-full object-cover ring-4'
                onError={(e) => {
                  // Fallback to Avatar if image fails
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling
                  if (fallback) fallback.classList.remove('hidden')
                }}
              />
              <Avatar className='ring-border hidden h-32 w-32 ring-4'>
                <AvatarFallback className='text-2xl'>
                  <User className='h-16 w-16' />
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className='relative'>
              <Avatar className='ring-border h-32 w-32 ring-4'>
                <AvatarFallback className='bg-muted text-2xl'>
                  <User className='h-16 w-16' />
                </AvatarFallback>
              </Avatar>
              <EmptyField text='No avatar uploaded' />
            </div>
          )}

          <h2 className='mt-4 text-2xl font-bold'>
            {doctor?.fullName || 'Unknown Doctor'}
          </h2>

          {doctor?.degree ? (
            <p className='text-muted-foreground text-sm'>{doctor.degree}</p>
          ) : (
            <EmptyField text='No degree specified' />
          )}

          {/* Active Status */}
          <div className='mt-4'>
            <Badge variant={doctor?.isActive ? 'default' : 'secondary'}>
              {doctor?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className='mt-6 w-full space-y-2 text-left'>
            <div className='bg-muted/50 rounded-md p-3'>
              <div className='text-muted-foreground mb-1 text-xs font-medium'>
                Email
              </div>
              {doctor?.email ? (
                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='text-muted-foreground h-4 w-4' />
                  <span className='truncate'>{doctor.email}</span>
                </div>
              ) : (
                <EmptyField text='No email provided' />
              )}
            </div>
            <div className='bg-muted/50 rounded-md p-3'>
              <div className='text-muted-foreground mb-1 text-xs font-medium'>
                Phone
              </div>
              {doctor?.phone ? (
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                  <span>{doctor.phone}</span>
                </div>
              ) : (
                <EmptyField text='No phone number' />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

