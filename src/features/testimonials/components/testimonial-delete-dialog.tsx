import type { Testimonial } from '@/api/services/testimonial.service'
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
import { useDeleteTestimonial } from '../data/use-testimonials'

interface TestimonialDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testimonial: Testimonial | null
}

export function TestimonialDeleteDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialDeleteDialogProps) {
  const { mutate, isPending } = useDeleteTestimonial()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
          <AlertDialogDescription>
            {testimonial
              ? `Thao tác này không thể hoàn tác. Đánh giá từ «${testimonial.authorName}».`
              : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !testimonial}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            onClick={() => {
              if (testimonial) {
                mutate(testimonial.id, { onSuccess: () => onOpenChange(false) })
              }
            }}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
