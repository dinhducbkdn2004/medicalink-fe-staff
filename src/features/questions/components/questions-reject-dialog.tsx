/**
 * Question Reject Dialog
 * Dialog for rejecting a question
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
import { useUpdateQuestion } from '../data/use-questions'
import { useQuestions } from './questions-provider'

export function QuestionsRejectDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const updateQuestion = useUpdateQuestion()

  const handleReject = async () => {
    if (!currentQuestion) return

    updateQuestion.mutate(
      {
        id: currentQuestion.id,
        data: { status: 'REJECTED' },
      },
      {
        onSuccess: () => {
          setOpen('reject')
        },
      }
    )
  }

  return (
    <AlertDialog open={open.reject} onOpenChange={() => setOpen('reject')}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Question</AlertDialogTitle>
          <AlertDialogDescription>
            Reject this question? It will be hidden from doctors and will not
            receive answers.
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
          <AlertDialogCancel disabled={updateQuestion.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={updateQuestion.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {updateQuestion.isPending ? 'Rejecting...' : 'Reject'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

