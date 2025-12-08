/**
 * Question Answer Form
 * Form for creating or updating an answer
 */
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { Answer } from '../data/schema'
import { useCreateAnswer, useUpdateAnswer } from '../data/use-answers'

// ============================================================================
// Form Schema
// ============================================================================

const formSchema = z.object({
  body: z
    .string()
    .min(10, 'Answer must be at least 10 characters')
    .max(5000, 'Answer must be less than 5000 characters'),
})

type FormValues = z.infer<typeof formSchema>

// ============================================================================
// Props
// ============================================================================

interface QuestionsAnswerFormProps {
  questionId: string
  answerToEdit?: Answer | null
  onSuccess?: () => void
  onCancel?: () => void
}

// ============================================================================
// Component
// ============================================================================

export function QuestionsAnswerForm({
  questionId,
  answerToEdit,
  onSuccess,
  onCancel,
}: QuestionsAnswerFormProps) {
  const createAnswerMutation = useCreateAnswer()
  const updateAnswerMutation = useUpdateAnswer()

  const isEditing = !!answerToEdit
  const isPending =
    createAnswerMutation.isPending || updateAnswerMutation.isPending

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
  })

  useEffect(() => {
    if (answerToEdit) {
      form.reset({
        body: answerToEdit.body,
      })
    }
  }, [answerToEdit, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && answerToEdit) {
        await updateAnswerMutation.mutateAsync({
          answerId: answerToEdit.id,
          data: { body: values.body },
        })
      } else {
        await createAnswerMutation.mutateAsync({
          questionId,
          data: { body: values.body },
        })
        form.reset()
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='body'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={
                    isEditing
                      ? 'Update your answer...'
                      : 'Write your answer here...'
                  }
                  className='min-h-[100px] resize-y'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end gap-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type='submit'
            size='sm'
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending ? (
              <Loader2 className='mr-2 size-3 animate-spin' />
            ) : (
              <Send className='mr-2 size-3' />
            )}
            {isEditing ? 'Update Answer' : 'Post Answer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
