import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
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
import { type Specialty, type SpecialtyInfoSection } from '../data/schema'
import {
  useCreateInfoSection,
  useUpdateInfoSection,
} from '../data/use-specialties'

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Tiêu đề phải có ít nhất 2 ký tự')
    .max(120, 'Tiêu đề không được vượt quá 120 ký tự'),
  content: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface InfoSectionFormProps {
  open: boolean
  onOpenChange: () => void
  specialty: Specialty
  section?: SpecialtyInfoSection | null
}

export function InfoSectionForm({
  open,
  onOpenChange,
  specialty,
  section,
}: Readonly<InfoSectionFormProps>) {
  const isEditMode = !!section
  const createMutation = useCreateInfoSection()
  const updateMutation = useUpdateInfoSection()
  const accessToken = useAuthStore((state) => state.accessToken)

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      content: '',
    },
  })

  useEffect(() => {
    if (open && isEditMode && section) {
      form.reset({
        title: section.title,
        content: section.content || '',
      })
    } else if (open && !isEditMode) {
      form.reset({
        title: '',
        content: '',
      })
    }
  }, [open, isEditMode, section, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditMode && section) {
        await updateMutation.mutateAsync({
          id: section.id,
          specialtyId: specialty.id,
          data: {
            title: values.title,
            content: values.content || '',
          },
        })
      } else {
        await createMutation.mutateAsync({
          specialtyId: specialty.id,
          title: values.title,
          content: values.content || '',
        })
      }

      onOpenChange()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Drawer
      direction='right'
      open={open}
      dismissible={false}
      onOpenChange={onOpenChange}
    >
      <DrawerContent
        className='h-full w-full sm:!max-w-[800px]'
        onOverlayClick={onOpenChange}
      >
        <DrawerHeader>
          <DrawerTitle>
            {isEditMode ? 'Chỉnh sửa phần thông tin' : 'Tạo phần thông tin'}
          </DrawerTitle>
          <DrawerDescription>
            {isEditMode
              ? 'Cập nhật nội dung phần thông tin dưới đây.'
              : `Thêm phần thông tin mới cho ${specialty.name}.`}
          </DrawerDescription>
        </DrawerHeader>

        <div className='flex-1 overflow-y-auto p-4'>
          <div className='flex flex-col gap-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                {}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề phần</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='ví dụ: Tổng quan, Các bệnh lý phổ biến, Các phương pháp điều trị'
                          {...field}
                          disabled={isLoading}
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Tiêu đề của phần thông tin này (2-120 ký tự)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Nhập nội dung chi tiết cho phần này...'
                          disabled={isLoading}
                          toolbarOptions='basic'
                          accessToken={accessToken || ''}
                          enableSyntax={true}
                          enableFormula={true}
                          enableImageUpload={true}
                          enableVideoUpload={true}
                          size='medium'
                        />
                      </FormControl>
                      <FormDescription>
                        Nội dung của phần này (hỗ trợ định dạng văn bản đa dạng, khối mã và công thức)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onOpenChange}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    )}
                    {isEditMode ? 'Cập nhật' : 'Tạo'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
