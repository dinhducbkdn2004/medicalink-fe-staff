
import { UsersRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PermissionStatusBadge } from '../../components'
import { usePermissionGroups } from '../../hooks'

type GroupListProps = {
  selectedGroupId?: string
  onSelectGroup: (groupId: string) => void
}

export function GroupList({ selectedGroupId, onSelectGroup }: GroupListProps) {
  const { data: groups, isLoading } = usePermissionGroups()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UsersRound className='h-5 w-5' />
          Permission Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='text-muted-foreground flex items-center justify-center py-8'>
            Loading groups...
          </div>
        ) : !groups || groups.length === 0 ? (
          <div className='text-muted-foreground flex items-center justify-center py-8'>
            No groups found
          </div>
        ) : (
          <div className='max-h-[600px] space-y-2 overflow-y-auto'>
            {groups.map((group) => (
              <Button
                key={group.id}
                variant='ghost'
                className={cn(
                  'h-auto w-full justify-start py-4 text-left',
                  selectedGroupId === group.id && 'bg-muted'
                )}
                onClick={() => onSelectGroup(group.id)}
              >
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{group.name}</span>
                    <PermissionStatusBadge isActive={group.isActive} />
                  </div>
                  {group.description && (
                    <p className='text-muted-foreground line-clamp-2 text-xs'>
                      {group.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary' className='text-xs'>
                      {group.memberCount || 0} members
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {group.permissionCount || 0} permissions
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
