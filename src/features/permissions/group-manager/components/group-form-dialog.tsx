import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import { useCreatePermissionGroup, useUpdatePermissionGroup } from '../../hooks'
import { useGroupManager } from './use-group-manager'

const groupFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must not exceed 50 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  tenantId: z.string().optional(),
})

type GroupFormValues = z.infer<typeof groupFormSchema>

type GroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupFormDialog({
  open,
  onOpenChange,
}: Readonly<GroupFormDialogProps>) {
  const { currentGroup, setCurrentGroup } = useGroupManager()
  const isEditMode = !!currentGroup

  const createMutation = useCreatePermissionGroup()
  const updateMutation = useUpdatePermissionGroup()

  const form = useForm<GroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(groupFormSchema) as any,
    defaultValues: {
      name: currentGroup?.name || '',
      description: currentGroup?.description || '',
      tenantId: currentGroup?.tenantId || 'global',
    },
  })

  const onSubmit = async (data: GroupFormValues) => {
    try {
      if (isEditMode && currentGroup) {
        await updateMutation.mutateAsync({
          groupId: currentGroup.id,
          data: {
            name: data.name,
            description: data.description,
          },
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      handleClose()
    } catch {
      void 0
    }
  }

  const handleClose = () => {
    form.reset()
    setCurrentGroup(null)
    onOpenChange(false)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Permission Group' : 'Create Permission Group'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the permission group details.'
              : 'Create a new permission group to organize permissions.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Admins, Doctors'
                      {...field}
                      disabled={currentGroup?.name.toLowerCase() === 'admin'}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name for this permission group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the purpose of this group...'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description of this permission group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {(() => {
                  if (isPending) {
                    return isEditMode ? 'Updating...' : 'Creating...'
                  }
                  return isEditMode ? 'Update Group' : 'Create Group'
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
