
import { useLogout } from '@/hooks/use-auth'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const logoutMutation = useLogout()

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync()
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Đăng xuất'
      desc='Bạn có chắc chắn muốn đăng xuất không? Bạn sẽ cần đăng nhập lại để truy cập tài khoản.'
      confirmText='Đăng xuất'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
