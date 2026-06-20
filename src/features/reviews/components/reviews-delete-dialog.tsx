
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteReview } from '../data/use-reviews'
import { useReviews } from './use-reviews'





export function ReviewDeleteDialog() {
  const { openDialog, setOpen, currentReview, onReviewDeleted } = useReviews()
  const isOpen = openDialog === 'delete'
  const deleteMutation = useDeleteReview()

  if (!currentReview) return null

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(currentReview.id)
      setOpen(null)

      onReviewDeleted?.()
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-destructive flex items-center gap-2'>
            <AlertTriangle className='size-5' />
            Xóa đánh giá
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa đánh giá này? Thao tác này sẽ xóa vĩnh viễn
            khỏi hệ thống và không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <Alert variant='destructive'>
          <AlertTriangle className='size-4' />
          <AlertDescription>
            Xóa đánh giá này sẽ xóa vĩnh viễn khỏi hệ thống.
          </AlertDescription>
        </Alert>

        <div className='rounded-lg border p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>{currentReview.authorName}</span>
            <span className='text-muted-foreground text-sm'>
              Đánh giá: {currentReview.rating}/5 ⭐
            </span>
          </div>
          <div className='text-muted-foreground mb-2 text-sm'>
            bác sĩ: {currentReview.doctor?.fullName ?? 'Unknown Doctor'}
          </div>
          <p className='line-clamp-2 text-sm'>{currentReview.body}</p>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className='mr-2 size-4' />
                Xóa đánh giá
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
