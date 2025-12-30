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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermissionGroups, useAddUserToGroup } from '../../hooks'

const addToGroupSchema = z.object({
  groupId: z.string().min(1, 'Please select a group'),
  tenantId: z.string().optional(),
})

type AddToGroupDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  existingGroupIds: string[]
}

export function AddToGroupDialog({
  open,
  onOpenChange,
  userId,
  existingGroupIds,
}: AddToGroupDialogProps) {
  const { data: allGroups } = usePermissionGroups()
  const addMutation = useAddUserToGroup()

  const availableGroups =
    allGroups?.filter((group) => !existingGroupIds.includes(group.id)) || []

  const form = useForm<z.infer<typeof addToGroupSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addToGroupSchema) as any,
    defaultValues: {
      groupId: '',
      tenantId: 'global',
    },
  })

  const onSubmit = async (values: z.infer<typeof addToGroupSchema>) => {
    try {
      await addMutation.mutateAsync({
        userId,
        groupId: values.groupId,
        tenantId: values.tenantId,
      })
      form.reset()
      onOpenChange(false)
    } catch {
      void 0
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User to Group</DialogTitle>
          <DialogDescription>
            Add this user to a permission group. They will inherit all
            permissions from the group.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={addMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a group' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableGroups.length === 0 ? (
                        <div className='text-muted-foreground px-2 py-1.5 text-sm'>
                          No groups available
                        </div>
                      ) : (
                        availableGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className='flex flex-col'>
                              <span className='font-medium'>{group.name}</span>
                              {group.description && (
                                <span className='text-muted-foreground text-xs'>
                                  {group.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a group to add the user to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tenantId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant ID</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={addMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select tenant' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='global'>Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The tenant scope for this membership
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={addMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add to Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
