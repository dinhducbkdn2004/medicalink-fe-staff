import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  answerService,
  type CreateAnswerRequest,
  type UpdateAnswerRequest,
  type AnswerQueryParams,
} from '@/api/services'
import { questionKeys } from './use-questions'

export const answerKeys = {
  all: ['answers'] as const,
  lists: () => [...answerKeys.all, 'list'] as const,
  list: (questionId: string, params: AnswerQueryParams) =>
    [...answerKeys.lists(), questionId, params] as const,
  details: () => [...answerKeys.all, 'detail'] as const,
  detail: (id: string) => [...answerKeys.details(), id] as const,
}

export function useAnswersForQuestion(
  questionId: string,
  params: AnswerQueryParams = {}
) {
  return useQuery({
    queryKey: answerKeys.list(questionId, params),
    queryFn: () => answerService.getAnswersForQuestion(questionId, params),
    enabled: !!questionId,
    staleTime: 30000,
  })
}

export function useAnswer(answerId: string) {
  return useQuery({
    queryKey: answerKeys.detail(answerId),
    queryFn: () => answerService.getAnswer(answerId),
    enabled: !!answerId,
  })
}

export function useCreateAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string
      data: CreateAnswerRequest
    }) => answerService.createAnswer(questionId, data),
    onSuccess: (_answer, variables) => {
      toast.success('Answer submitted successfully')
      queryClient.invalidateQueries({
        queryKey: answerKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to submit answer', {
        description: error.message,
      })
    },
  })
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      answerId,
      data,
    }: {
      answerId: string
      data: UpdateAnswerRequest
    }) => answerService.updateAnswer(answerId, data),
    onSuccess: (updatedAnswer) => {
      toast.success('Answer updated successfully')
      queryClient.invalidateQueries({ queryKey: answerKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: answerKeys.detail(updatedAnswer.id),
      })
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(updatedAnswer.questionId),
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to update answer', {
        description: error.message,
      })
    },
  })
}

export function useAcceptAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answerId: string) => answerService.acceptAnswer(answerId),
    onSuccess: (acceptedAnswer) => {
      toast.success('Answer accepted successfully')
      queryClient.invalidateQueries({ queryKey: answerKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: answerKeys.detail(acceptedAnswer.id),
      })
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(acceptedAnswer.questionId),
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to accept answer', {
        description: error.message,
      })
    },
  })
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answerId: string) => answerService.deleteAnswer(answerId),
    onSuccess: () => {
      toast.success('Answer deleted successfully')
      queryClient.invalidateQueries({ queryKey: answerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to delete answer', {
        description: error.message,
      })
    },
  })
}
