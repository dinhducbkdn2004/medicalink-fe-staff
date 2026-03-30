import type { Faq } from '@/api/services/faq.service'
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
import { useDeleteFaq } from '../data/use-faqs'

interface FaqDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faq: Faq | null
}

export function FaqDeleteDialog({
  open,
  onOpenChange,
  faq,
}: FaqDeleteDialogProps) {
  const { mutate, isPending } = useDeleteFaq()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
          <AlertDialogDescription>
            {faq
              ? `This action cannot be undone. FAQ: «${faq.question.slice(0, 80)}${faq.question.length > 80 ? '…' : ''}»`
              : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !faq}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            onClick={() => {
              if (faq) {
                mutate(faq.id, { onSuccess: () => onOpenChange(false) })
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
