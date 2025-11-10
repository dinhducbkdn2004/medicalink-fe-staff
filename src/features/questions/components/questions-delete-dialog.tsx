/**
 * Question Delete Dialog
 * Confirmation dialog for deleting a question
 */
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
import { useDeleteQuestion } from '../data/use-questions'
import { useQuestions } from './questions-provider'

export function QuestionsDeleteDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const deleteQuestion = useDeleteQuestion()

  const handleDelete = async () => {
    if (!currentQuestion) return

    deleteQuestion.mutate(currentQuestion.id, {
      onSuccess: () => {
        setOpen('delete')
      },
    })
  }

  return (
    <AlertDialog open={open.delete} onOpenChange={() => setOpen('delete')}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this question? This will also delete
            all associated answers. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {currentQuestion && (
          <div className='rounded-md bg-muted p-3'>
            <p className='text-sm font-medium'>{currentQuestion.title}</p>
            {currentQuestion.authorName && (
              <p className='mt-1 text-xs text-muted-foreground'>
                by {currentQuestion.authorName}
              </p>
            )}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteQuestion.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteQuestion.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteQuestion.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

