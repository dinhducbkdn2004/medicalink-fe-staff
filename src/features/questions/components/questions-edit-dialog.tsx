/**
 * Question Edit Dialog
 * Dialog for editing question details (Admin only)
 */
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateQuestion } from '../data/use-questions'
import { useSpecialties } from '../data/use-specialties'
import { useQuestions } from './use-questions'

// ============================================================================
// Form Schema
// ============================================================================

const formSchema = z.object({
  status: z.enum(['PENDING', 'ANSWERED', 'CLOSED']),
  specialtyId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// ============================================================================
// Component
// ============================================================================

export function QuestionsEditDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const { data: specialtiesData } = useSpecialties({ limit: 100 })
  const updateQuestionMutation = useUpdateQuestion()
  const isOpen = open.edit
  const specialties = specialtiesData?.data || []

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'PENDING',
      specialtyId: undefined,
    },
  })

  // Update form values when current question changes
  useEffect(() => {
    if (currentQuestion) {
      form.reset({
        status: currentQuestion.status as 'PENDING' | 'ANSWERED' | 'CLOSED',
        specialtyId: currentQuestion.specialtyId || undefined,
      })
    }
  }, [currentQuestion, form])

  const onSubmit = async (values: FormValues) => {
    if (!currentQuestion) return

    try {
      await updateQuestionMutation.mutateAsync({
        id: currentQuestion.id,
        // Send status and specialtyId
        data: {
          status: values.status,
          specialtyId: values.specialtyId,
        },
      })
      setOpen('edit')
    } catch (error) {
      console.error('Failed to update question:', error)
    }
  }

  // Handle dialog open change
  const handleOpenChange = () => {
    setOpen('edit')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Question Status</DialogTitle>
          <DialogDescription>
            Update the status of this question. Title and content cannot be
            changed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='specialtyId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select specialty' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='PENDING'>
                        <span className='flex items-center'>
                          <span className='mr-2 size-2 rounded-full bg-yellow-400' />
                          Pending
                        </span>
                      </SelectItem>
                      <SelectItem value='ANSWERED'>
                        <span className='flex items-center'>
                          <span className='mr-2 size-2 rounded-full bg-green-500' />
                          Answered
                        </span>
                      </SelectItem>
                      <SelectItem value='CLOSED'>
                        <span className='flex items-center'>
                          <span className='mr-2 size-2 rounded-full bg-red-500' />
                          Closed
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen('edit')}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  updateQuestionMutation.isPending || !form.formState.isDirty
                }
              >
                {updateQuestionMutation.isPending && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
