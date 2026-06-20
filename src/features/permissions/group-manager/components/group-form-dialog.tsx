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
    .min(3, 'Tên nhóm phải có ít nhất 3 ký tự')
    .max(50, 'Tên nhóm không được vượt quá 50 ký tự'),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
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
            {isEditMode ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin chi tiết của nhóm quyền.'
              : 'Tạo nhóm quyền mới để tổ chức các quyền.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhóm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='vd. Quản trị viên, Bác sĩ'
                      {...field}
                      disabled={currentGroup?.name.toLowerCase() === 'admin'}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên duy nhất cho nhóm quyền này.
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
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Mô tả mục đích của nhóm này...'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả tùy chọn cho nhóm quyền này.
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
                Hủy
              </Button>
              <Button type='submit' disabled={isPending}>
                {(() => {
                  if (isPending) {
                    return isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'
                  }
                  return isEditMode ? 'Cập nhật nhóm' : 'Tạo nhóm'
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
