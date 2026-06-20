
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateReview } from '../data/use-reviews'
import { useReviews } from './use-reviews'





export function ReviewApproveDialog() {
  const { openDialog, setOpen, currentReview } = useReviews()
  const isOpen = openDialog === 'approve'

  const updateMutation = useUpdateReview()

  if (!currentReview) return null

  const handleApprove = async () => {
    try {
      await updateMutation.mutateAsync({
        id: currentReview.id,
        status: 'APPROVED',
      })
      setOpen(null)
    } catch (error) {
      console.error('Failed to approve review:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='size-5 text-green-600' />
            Duyệt đánh giá
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn duyệt đánh giá này? Đánh giá sẽ hiển thị cho
            tất cả người dùng sau khi được duyệt.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-muted rounded-lg p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>{currentReview.patientName}</span>
            <span className='text-muted-foreground text-sm'>
              Đánh giá: {currentReview.rating}/5 ⭐
            </span>
          </div>
          <p className='line-clamp-3 text-sm'>{currentReview.comment}</p>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleApprove}
            disabled={updateMutation.isPending}
            className='bg-green-600 hover:bg-green-700'
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Đang duyệt...
              </>
            ) : (
              <>
                <CheckCircle className='mr-2 size-4' />
                Duyệt đánh giá
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
