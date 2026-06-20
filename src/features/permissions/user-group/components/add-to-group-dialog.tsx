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
  groupId: z.string().min(1, 'Vui lòng chọn một nhóm'),
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
          <DialogTitle>Thêm người dùng vào nhóm</DialogTitle>
          <DialogDescription>
            Thêm người dùng này vào một nhóm quyền. Họ sẽ thừa hưởng tất cả các quyền từ nhóm đó.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhóm quyền</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={addMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn một nhóm' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableGroups.length === 0 ? (
                        <div className='text-muted-foreground px-2 py-1.5 text-sm'>
                          Không có nhóm nào khả dụng
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
                    Chọn nhóm để thêm người dùng vào
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
                  <FormLabel>Mã Tenant</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={addMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn tenant' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='global'>Toàn cục (Global)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Phạm vi tenant cho thành viên này
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
                Hủy
              </Button>
              <Button type='submit' disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Đang thêm...' : 'Thêm vào nhóm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
