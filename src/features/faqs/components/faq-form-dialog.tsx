import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Faq } from '@/api/services/faq.service'
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
import { type FaqFormValues, faqFormSchema } from '../data/schema'
import { useCreateFaq, useUpdateFaq } from '../data/use-faqs'

interface FaqFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faq: Faq | null
}

export function FaqFormDialog({ open, onOpenChange, faq }: FaqFormDialogProps) {
  const { mutate: createFaq, isPending: isCreating } = useCreateFaq()
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq()
  const isPending = isCreating || isUpdating

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: '',
      answer: '',
      order: 0,
      isActive: true,
    },
  })

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive,
      })
    } else {
      form.reset({
        question: '',
        answer: '',
        order: 0,
        isActive: true,
      })
    }
  }, [faq, form, open])

  const onSubmit = (values: FaqFormValues) => {
    if (faq) {
      updateFaq(
        {
          id: faq.id,
          data: {
            question: values.question,
            answer: values.answer,
            order: values.order,
            isActive: values.isActive,
          },
        },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createFaq(
        {
          question: values.question,
          answer: values.answer,
          order: values.order,
          isActive: values.isActive,
        },
        { onSuccess: () => onOpenChange(false) }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{faq ? 'Chỉnh sửa Câu hỏi' : 'Thêm Câu hỏi'}</DialogTitle>
          <DialogDescription>
            Nội dung hiển thị trên trang chủ (landing) khi trạng thái được bật.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='question'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu hỏi</FormLabel>
                  <FormControl>
                    <Input placeholder='Tối đa 255 ký tự' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu trả lời</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder='Nội dung câu trả lời' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='order'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự</FormLabel>
                  <FormControl>
                    <Input type='number' min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='!mt-0'>Hiển thị trên trang web</FormLabel>
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
