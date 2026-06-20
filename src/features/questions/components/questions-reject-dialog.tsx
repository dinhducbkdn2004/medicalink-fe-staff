
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
import { useQuestions } from './use-questions'

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
          <AlertDialogTitle>Từ chối câu hỏi</AlertDialogTitle>
          <AlertDialogDescription>
            Từ chối câu hỏi này? Nó sẽ bị ẩn khỏi bác sĩ và không nhận được câu
            trả lời.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {currentQuestion && (
          <div className='bg-muted rounded-md p-3'>
            <p className='text-sm font-medium'>{currentQuestion.title}</p>
            {currentQuestion.authorName && (
              <p className='text-muted-foreground mt-1 text-xs'>
                bởi {currentQuestion.authorName}
              </p>
            )}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateQuestion.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={updateQuestion.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {updateQuestion.isPending ? 'Đang từ chối...' : 'Từ chối'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
