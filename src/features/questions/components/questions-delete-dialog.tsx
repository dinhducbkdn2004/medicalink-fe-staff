
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
import { useQuestions } from './use-questions'

export function QuestionsDeleteDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const deleteQuestion = useDeleteQuestion()

  const handleDelete = async () => {
    if (!currentQuestion) return

    deleteQuestion.mutate(currentQuestion.id, {
      onSuccess: () => {
        setOpen('delete', false)
      },
    })
  }

  return (
    <AlertDialog open={open.delete} onOpenChange={() => setOpen('delete')}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa câu hỏi</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa câu hỏi này? Thao tác này sẽ xóa tất cả các
            câu trả lời liên quan. Thao tác này không thể hoàn tác.
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
          <AlertDialogCancel disabled={deleteQuestion.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={deleteQuestion.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteQuestion.isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
