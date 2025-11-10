/**
 * Question Approve Dialog
 * Dialog for approving a question
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

export function QuestionsApproveDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const updateQuestion = useUpdateQuestion()

  const handleApprove = async () => {
    if (!currentQuestion) return

    updateQuestion.mutate(
      {
        id: currentQuestion.id,
        data: { status: 'APPROVED' },
      },
      {
        onSuccess: () => {
          setOpen('approve')
        },
      }
    )
  }

  return (
    <AlertDialog open={open.approve} onOpenChange={() => setOpen('approve')}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Question</AlertDialogTitle>
          <AlertDialogDescription>
            Approve this question to make it visible to doctors for answering?
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
            onClick={handleApprove}
            disabled={updateQuestion.isPending}
          >
            {updateQuestion.isPending ? 'Approving...' : 'Approve'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

