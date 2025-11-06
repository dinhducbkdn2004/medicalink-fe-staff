/**
 * Group Form Dialog
 * Dialog for creating or editing permission groups
 */
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePermissionGroup, useUpdatePermissionGroup } from '../../hooks'
import { useGroupManager } from './group-manager-provider'

const groupFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must not exceed 50 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  isActive: z.boolean().default(true),
  tenantId: z.string().optional(),
})

type GroupFormValues = z.infer<typeof groupFormSchema>

type GroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupFormDialog({ open, onOpenChange }: GroupFormDialogProps) {
  const { currentGroup, setCurrentGroup } = useGroupManager()
  const isEditMode = !!currentGroup

  const createMutation = useCreatePermissionGroup()
  const updateMutation = useUpdatePermissionGroup()

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: currentGroup?.name || '',
      description: currentGroup?.description || '',
      isActive: currentGroup?.isActive ?? true,
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
            isActive: data.isActive,
          },
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      handleClose()
    } catch {
      // Error handling is done in mutation hooks
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
                    <Input placeholder='e.g., Admins, Doctors' {...field} />
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

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Active Status</FormLabel>
                    <FormDescription>
                      Inactive groups will not grant any permissions to members.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {isPending
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Update Group'
                    : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
