import { useState } from 'react'
import { format } from 'date-fns'
import { UsersRound, UserPlus, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStaffs } from '@/features/staffs/data/use-staffs'
import { useRemoveUserFromGroup } from '../../hooks'
import { AddMembersDialog } from './add-members-dialog'

type GroupMembersPanelProps = {
  groupId?: string
}

export function GroupMembersPanel({ groupId }: GroupMembersPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removeMemberId, setRemoveMemberId] = useState<string>()

  const { data: staffsData, isLoading } = useStaffs({
    page: 1,
    limit: 100,
  })

  const removeMutation = useRemoveUserFromGroup()

  const members = staffsData?.data || []

  const handleRemove = async () => {
    if (!groupId || !removeMemberId) return

    try {
      await removeMutation.mutateAsync({
        userId: removeMemberId,
        groupId,
      })
      setRemoveMemberId(undefined)
    } catch {
      void 0
    }
  }

  if (!groupId) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-16'>
          <div className='text-muted-foreground text-center'>
            <UsersRound className='mx-auto mb-4 h-12 w-12' />
            <p>Chọn một nhóm để xem danh sách thành viên</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Thành viên nhóm</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              Thêm thành viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground flex items-center justify-center py-8'>
              Đang tải danh sách thành viên...
            </div>
          ) : members.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              <p>Chưa có thành viên trong nhóm</p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className='mr-2 h-4 w-4' />
                Thêm thành viên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thành viên</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className='w-[100px] text-right'>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-medium text-base'>{member.fullName}</span>
                        <span className='text-muted-foreground text-sm'>{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='font-normal'>{member.role}</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {format(new Date(member.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-destructive'
                        onClick={() => setRemoveMemberId(member.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {}
      <AddMembersDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        groupId={groupId}
      />

      {}
      <AlertDialog
        open={!!removeMemberId}
        onOpenChange={(open) => !open && setRemoveMemberId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm? Họ sẽ mất tất cả quyền hạn thừa hưởng từ nhóm này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {removeMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
