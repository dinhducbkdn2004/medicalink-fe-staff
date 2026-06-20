import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Testimonial } from '@/api/services/testimonial.service'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  type TestimonialFormValues,
  testimonialFormSchema,
} from '../data/schema'
import { useCreateTestimonial, useUpdateTestimonial } from '../data/use-testimonials'

interface TestimonialFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testimonial: Testimonial | null
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialFormDialogProps) {
  const { mutate: createT, isPending: isCreating } = useCreateTestimonial()
  const { mutate: updateT, isPending: isUpdating } = useUpdateTestimonial()
  const isPending = isCreating || isUpdating

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      authorName: '',
      authorAvatar: '',
      authorTitle: '',
      content: '',
      rating: 5,
      isFeatured: false,
    },
  })

  useEffect(() => {
    if (testimonial) {
      form.reset({
        authorName: testimonial.authorName,
        authorAvatar: testimonial.authorAvatar || '',
        authorTitle: testimonial.authorTitle || '',
        content: testimonial.content,
        rating: testimonial.rating ?? 5,
        isFeatured: testimonial.isFeatured,
      })
    } else {
      form.reset({
        authorName: '',
        authorAvatar: '',
        authorTitle: '',
        content: '',
        rating: 5,
        isFeatured: false,
      })
    }
  }, [testimonial, form, open])

  const onSubmit = (values: TestimonialFormValues) => {
    const payload = {
      authorName: values.authorName,
      content: values.content,
      rating: values.rating,
      isFeatured: values.isFeatured,
      ...(values.authorTitle ? { authorTitle: values.authorTitle } : {}),
      ...(values.authorAvatar?.trim()
        ? { authorAvatar: values.authorAvatar.trim() }
        : {}),
    }

    if (testimonial) {
      updateT(
        { id: testimonial.id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createT(payload, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {testimonial ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}
          </DialogTitle>
          <DialogDescription>
            Đánh giá nổi bật được hiển thị trên trang chủ công khai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='authorName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input placeholder='Họ và tên' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='authorTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức danh / mô tả ngắn</FormLabel>
                  <FormControl>
                    <Input placeholder='Ví dụ: Bệnh nhân' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='authorAvatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Ảnh đại diện (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder='https://...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá (1–5 sao)</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} max={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='!mt-0'>Hiển thị nổi bật (trang chủ)</FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
