import { UsersRound, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PermissionStatusBadge } from '../../components'
import { usePermissionGroups } from '../../hooks'

type GroupListProps = {
  selectedGroupId?: string
  onSelectGroup: (groupId: string) => void
}

export function GroupList({ selectedGroupId, onSelectGroup }: GroupListProps) {
  const { data: groups, isLoading } = usePermissionGroups()

  return (
    <Card className='border-muted/40 shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <div className='bg-primary/10 rounded-lg p-2'>
              <UsersRound className='text-primary h-4 w-4' />
            </div>
            Nhóm quyền
          </CardTitle>
          <Badge variant='secondary' className='text-xs'>
            Tổng cộng {groups?.length || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='text-muted-foreground flex items-center justify-center py-12'>
            Đang tải danh sách nhóm...
          </div>
        ) : !groups || groups.length === 0 ? (
          <div className='text-muted-foreground flex items-center justify-center py-12'>
            Không tìm thấy nhóm nào
          </div>
        ) : (
          <ScrollArea className='h-[min(520px,50vh)] min-h-[200px]'>
            <div className='space-y-1 p-2'>
              {groups.map((group) => (
                <Button
                  key={group.id}
                  variant='ghost'
                  className={cn(
                    'h-auto w-full justify-start p-3 text-left transition-all',
                    selectedGroupId === group.id && 'bg-accent ring-primary/20 shadow-sm ring-1'
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
                    <div className='flex items-center gap-2 mt-1'>
                      <Badge variant='secondary' className='h-5 text-xs'>
                        {group.memberCount || 0} thành viên
                      </Badge>
                      <Badge variant='outline' className='h-5 text-xs bg-background'>
                        {group.permissionCount || 0} quyền
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
