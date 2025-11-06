/**
 * User List Component
 * Displays list of users for permission management
 */
import { useState } from 'react'
import { Search, Users, UserCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { Staff } from '@/features/staffs/data/schema'
import { useStaffs } from '@/features/staffs/data/use-staffs'

type UserListProps = {
  selectedUserId?: string
  onSelectUser: (userId: string) => void
}

export function UserList({ selectedUserId, onSelectUser }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch staffs (admins and doctors have staff accounts)
  const { data, isLoading } = useStaffs({
    page: 1,
    limit: 50,
    search: searchTerm || undefined,
  })

  const users = data?.data || []

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'destructive'
      case 'ADMIN':
        return 'default'
      case 'DOCTOR':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card className='border-muted/40 shadow-sm'>
      <CardHeader className='space-y-3 pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <div className='rounded-lg bg-primary/10 p-2'>
              <Users className='h-4 w-4 text-primary' />
            </div>
            Users
          </CardTitle>
          <Badge variant='secondary' className='text-xs'>
            {users.length} total
          </Badge>
        </div>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input
            type='search'
            placeholder='Search by name or email...'
            className='h-9 pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='space-y-2 p-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-3'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-40' />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 py-12'>
            <div className='rounded-full bg-muted p-3'>
              <UserCircle2 className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='text-center'>
              <p className='text-sm font-medium'>No users found</p>
              <p className='text-muted-foreground text-xs'>
                Try adjusting your search
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className='h-[600px]'>
            <div className='space-y-1 p-2'>
              {users.map((user: Staff) => (
                <HoverCard key={user.id} openDelay={300}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant='ghost'
                      className={cn(
                        'h-auto w-full justify-start gap-3 p-3 transition-all',
                        selectedUserId === user.id &&
                          'bg-accent shadow-sm ring-1 ring-primary/20'
                      )}
                      onClick={() => onSelectUser(user.id)}
                    >
                      <Avatar className='h-10 w-10 border-2 border-background shadow-sm'>
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className='bg-primary/10 text-xs font-semibold'>
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-1 text-left'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium'>
                            {user.fullName}
                          </span>
                          <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className='h-5 text-xs'
                          >
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground truncate text-xs'>
                          {user.email}
                        </p>
                      </div>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side='right'
                    className='w-80'
                    align='start'
                  >
                    <div className='space-y-3'>
                      <div className='flex items-start gap-3'>
                        <Avatar className='h-12 w-12 border-2 border-primary/20'>
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback className='bg-primary/10 text-sm font-semibold'>
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 space-y-1'>
                          <h4 className='text-sm font-semibold'>
                            {user.fullName}
                          </h4>
                          <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className='h-5'
                          >
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className='space-y-2 text-sm'>
                        <div>
                          <span className='text-muted-foreground text-xs'>
                            Email
                          </span>
                          <p className='font-medium'>{user.email}</p>
                        </div>
                        {user.phoneNumber && (
                          <div>
                            <span className='text-muted-foreground text-xs'>
                              Phone
                            </span>
                            <p className='font-medium'>{user.phoneNumber}</p>
                          </div>
                        )}
                        <div>
                          <span className='text-muted-foreground text-xs'>
                            Status
                          </span>
                          <div className='mt-1'>
                            <Badge
                              variant={
                                user.isActive ? 'default' : 'secondary'
                              }
                              className='text-xs'
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
