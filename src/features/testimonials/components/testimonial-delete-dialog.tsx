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
          <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
          <AlertDialogDescription>
            {testimonial
              ? `This action cannot be undone. Testimonial from «${testimonial.authorName}».`
              : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !testimonial}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            onClick={() => {
              if (testimonial) {
                mutate(testimonial.id, { onSuccess: () => onOpenChange(false) })
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
