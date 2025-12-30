import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  questionService,
  type CreateQuestionRequest,
  type UpdateQuestionRequest,
  type QuestionQueryParams,
} from '@/api/services'

export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (params: QuestionQueryParams) =>
    [...questionKeys.lists(), params] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
}

export function useQuestions(params: QuestionQueryParams = {}) {
  return useQuery({
    queryKey: questionKeys.list(params),
    queryFn: () => questionService.getQuestions(params),
    staleTime: 30000,
  })
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionService.getQuestion(id),
    enabled: !!id,
  })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      questionService.createQuestion(data),
    onSuccess: () => {
      toast.success('Question submitted successfully', {
        description:
          'Your question will be reviewed and answered by our doctors',
      })
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to submit question', {
        description: error.message || 'Please try again later',
      })
    },
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      questionService.updateQuestion(id, data),
    onSuccess: (updatedQuestion) => {
      toast.success('Question updated successfully')
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(updatedQuestion.id),
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to update question', {
        description: error.message,
      })
    },
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      toast.success('Question deleted successfully')
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to delete question', {
        description: error.message,
      })
    },
  })
}
