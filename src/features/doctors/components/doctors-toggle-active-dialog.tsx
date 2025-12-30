

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
          <DialogTitle>{isActive ? 'Deactivate' : 'Activate'} Doctor Profile</DialogTitle>
          <DialogDescription>
            {isActive
              ? 'This will hide the doctor from public listings and prevent new appointments.'
              : 'This will make the doctor visible in public listings and allow new appointments.'}
          </DialogDescription>
        </DialogHeader>

        {currentRow && (
          <div className="rounded-md bg-muted p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{currentRow.fullName}</p>
              <p className="text-sm text-muted-foreground">{currentRow.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">Current Status:</span>
                <span
                  className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-600'}`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleToggle} disabled={isPending || !profileId}>
            {isPending
              ? isActive
                ? 'Deactivating...'
                : 'Activating...'
              : isActive
                ? 'Deactivate'
                : 'Activate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

