import { BlogCategory } from '@/api/services/blog.service'
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
import { useDeleteBlogCategory } from '../data/use-blog-categories'

interface CategoryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: BlogCategory | null
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
}: CategoryDeleteDialogProps) {
  const { mutate, isPending } = useDeleteBlogCategory()

  const handleDelete = () => {
    if (category) {
      mutate(category.id, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category &quot;{category?.name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
