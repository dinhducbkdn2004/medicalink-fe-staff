
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
          <AlertDialogTitle>Duyệt câu hỏi</AlertDialogTitle>
          <AlertDialogDescription>
            Duyệt câu hỏi này để hiển thị cho bác sĩ trả lời?
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
            onClick={handleApprove}
            disabled={updateQuestion.isPending}
          >
            {updateQuestion.isPending ? 'Đang duyệt...' : 'Duyệt'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
