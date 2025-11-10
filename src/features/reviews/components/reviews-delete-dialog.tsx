/**
 * Review Delete Dialog
 * Dialog for deleting a review with confirmation
 */
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDeleteReview } from '../data/use-reviews'
import { useReviews } from './reviews-provider'

// ============================================================================
// Component
// ============================================================================

export function ReviewDeleteDialog() {
  const { openDialog, setOpen, currentReview } = useReviews()
  const isOpen = openDialog === 'delete'
  const deleteMutation = useDeleteReview()

  if (!currentReview) return null

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(currentReview.id)
      setOpen(null)
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='size-5' />
            Delete Review
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <Alert variant='destructive'>
          <AlertTriangle className='size-4' />
          <AlertDescription>
            Deleting this review will permanently remove it from the system.
          </AlertDescription>
        </Alert>

        <div className='rounded-lg border p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>{currentReview.patientName}</span>
            <span className='text-sm text-muted-foreground'>
              Rating: {currentReview.rating}/5 ⭐
            </span>
          </div>
          <div className='mb-2 text-sm text-muted-foreground'>
            For: {currentReview.doctor.fullName}
          </div>
          <p className='line-clamp-2 text-sm'>{currentReview.comment}</p>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='mr-2 size-4' />
                Delete Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

