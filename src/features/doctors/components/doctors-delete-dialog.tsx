

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
          <DialogTitle>Delete Doctor Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this doctor account? This action cannot be
            undone.
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
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

