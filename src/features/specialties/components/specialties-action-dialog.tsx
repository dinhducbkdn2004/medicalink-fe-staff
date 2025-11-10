/**
 * Specialties Action Dialog
 * Create/Edit specialty form dialog
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/features/doctors/components/rich-text-editor'
import { type Specialty } from '../data/schema'
import {
  useCreateSpecialty,
  useUpdateSpecialty,
} from '../data/use-specialties'
import { useAuthStore } from '@/stores/auth-store'

// ============================================================================
// Types & Schema
// ============================================================================

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be at most 120 characters'),
  description: z.string().optional(),
  iconUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface SpecialtiesActionDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow?: Specialty
}

// ============================================================================
// Component
// ============================================================================

export function SpecialtiesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: SpecialtiesActionDialogProps) {
  const isEditMode = !!currentRow
  const createMutation = useCreateSpecialty()
  const updateMutation = useUpdateSpecialty()
  const accessToken = useAuthStore((state) => state.accessToken)

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      name: '',
      description: '',
      iconUrl: '',
    },
  })

  // Load current row data in edit mode
  useEffect(() => {
    if (open && isEditMode && currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || '',
        iconUrl: currentRow.iconUrl || '',
      })
    } else if (open && !isEditMode) {
      form.reset({
        name: '',
        description: '',
        iconUrl: '',
      })
    }
  }, [open, isEditMode, currentRow, form])

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const data = {
        name: values.name,
        description: values.description || undefined,
        iconUrl: values.iconUrl || undefined,
      }

      if (isEditMode && currentRow) {
        await updateMutation.mutateAsync({ id: currentRow.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }

      onOpenChange()
      form.reset()
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Specialty' : 'Create New Specialty'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the specialty information below.'
              : 'Fill in the information to create a new specialty.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Cardiology'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the medical specialty (2-120 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder='Brief description of the specialty...'
                      disabled={isLoading}
                      toolbarOptions='basic'
                      accessToken={accessToken || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description of the specialty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon URL */}
            <FormField
              control={form.control}
              name='iconUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      placeholder='https://example.com/icon.svg'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional URL to an icon/image for this specialty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onOpenChange}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

