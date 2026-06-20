

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToggleDoctorProfileActive } from '../data/use-doctor-profiles'
import { useDoctors } from './doctors-provider'

export function DoctorsToggleActiveDialog() {
  const { open, setOpen, currentRow } = useDoctors()
  const { mutate: toggleActive, isPending } = useToggleDoctorProfileActive()

  
  const isActive = currentRow?.isActive ?? false
  const profileId = currentRow?.profileId

  const handleToggle = () => {
    if (!profileId) return

    toggleActive(
      { id: profileId, data: { isActive: !isActive } },
      {
        onSuccess: () => {
          setOpen(null)
        },
      }
    )
  }

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Dialog
      open={open === 'toggleActive'}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isActive ? 'Ngừng hoạt động' : 'Kích hoạt'} Hồ sơ Bác sĩ</DialogTitle>
          <DialogDescription>
            {isActive
              ? 'Thao tác này sẽ ẩn bác sĩ khỏi danh sách công khai và ngăn nhận cuộc hẹn mới.'
              : 'Thao tác này sẽ hiển thị bác sĩ trong danh sách công khai và cho phép nhận cuộc hẹn mới.'}
          </DialogDescription>
        </DialogHeader>

        {currentRow && (
          <div className="rounded-md bg-muted p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{currentRow.fullName}</p>
              <p className="text-sm text-muted-foreground">{currentRow.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">Trạng thái hiện tại:</span>
                <span
                  className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-600'}`}
                >
                  {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleToggle} disabled={isPending || !profileId}>
            {isPending
              ? isActive
                ? 'Đang ngừng hoạt động...'
                : 'Đang kích hoạt...'
              : isActive
                ? 'Ngừng hoạt động'
                : 'Kích hoạt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

