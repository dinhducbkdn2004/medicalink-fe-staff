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
import { useDeletePermissionGroup } from '../../hooks'
import { useGroupManager } from './use-group-manager'

type GroupDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupDeleteDialog({
  open,
  onOpenChange,
}: GroupDeleteDialogProps) {
  const { currentGroup, setCurrentGroup } = useGroupManager()
  const deleteMutation = useDeletePermissionGroup()

  const handleDelete = async () => {
    if (!currentGroup) return

    try {
      await deleteMutation.mutateAsync(currentGroup.id)
      handleClose()
    } catch {
      void 0
    }
  }

  const handleClose = () => {
    setCurrentGroup(null)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhóm quyền</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhóm{' '}
            <span className='font-semibold'>{currentGroup?.name}</span>?
            <br />
            <br />
            Hành động này không thể hoàn tác. Tất cả các quyền được gán cho nhóm này sẽ bị xóa, và người dùng trong nhóm này sẽ mất các quyền được thừa kế.
            {currentGroup?.memberCount && currentGroup.memberCount > 0 && (
              <>
                <br />
                <br />
                <span className='text-destructive font-semibold'>
                  Cảnh báo: Nhóm này có {currentGroup.memberCount} thành viên.
                </span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa nhóm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
