

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteDoctor } from '../data/use-doctors'
import { useDoctors } from './doctors-provider'

export function DoctorsDeleteDialog() {
  const { open, setOpen, currentRow } = useDoctors()
  const { mutate: deleteDoctor, isPending } = useDeleteDoctor()

  const handleDelete = () => {
    if (!currentRow) return;

    deleteDoctor(currentRow.id, {
      onSuccess: () => {
        setOpen(null);
      },
    });
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Dialog open={open === 'delete'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xóa tài khoản Bác sĩ</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa tài khoản bác sĩ này không? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {currentRow && (
          <div className="rounded-md bg-muted p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{currentRow.fullName}</p>
              <p className="text-sm text-muted-foreground">{currentRow.email}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

