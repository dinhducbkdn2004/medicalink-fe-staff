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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type Specialty } from '../data/schema'
import { useCreateSpecialty, useUpdateSpecialty } from '../data/use-specialties'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(120, 'Tên không được vượt quá 120 ký tự'),
  description: z.string().optional(),
  iconUrl: z.string().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface SpecialtiesActionDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow?: Specialty
}

export function SpecialtiesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: SpecialtiesActionDialogProps) {
  const isEditMode = !!currentRow
  const createMutation = useCreateSpecialty()
  const updateMutation = useUpdateSpecialty()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      iconUrl: '',
    },
  })

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
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Chỉnh sửa chuyên khoa' : 'Tạo chuyên khoa mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin chuyên khoa dưới đây.'
              : 'Điền thông tin để tạo chuyên khoa mới.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='ví dụ: Tim mạch'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên của chuyên khoa y tế (2-120 ký tự)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Mô tả ngắn gọn về chuyên khoa...'
                      className='min-h-[100px] max-h-[200px] overflow-y-auto resize-none'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả tùy chọn về chuyên khoa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='iconUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biểu tượng</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || undefined}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Tải lên biểu tượng/hình ảnh cho chuyên khoa này (SVG, PNG, JPG)
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
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {isEditMode ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
