import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/date-picker'

const accountFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Vui lòng nhập họ và tên của bạn')
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự'),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  isMale: z.enum(['true', 'false', 'null']).optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { user, profile } = useAuth()
  const currentUser = profile || user

  const form = useForm({
    
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dateOfBirth: currentUser?.dateOfBirth
        ? new Date(currentUser.dateOfBirth)
        : undefined,
      isMale:
        currentUser?.isMale === null
          ? ('null' as const)
          : currentUser?.isMale
            ? ('true' as const)
            : ('false' as const),
    },
  })

  function onSubmit(data: AccountFormValues) {
    
    if (data.phone && data.phone.trim() !== '') {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(data.phone)) {
        toast.error('Số điện thoại phải từ 10-11 chữ số')
        return
      }
    }

    
    toast.success('Cập nhật hồ sơ thành công')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder='Nhập họ và tên của bạn' {...field} />
              </FormControl>
              <FormDescription>
                Đây là tên hiển thị của bạn trên toàn bộ nền tảng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='your.email@example.com'
                  disabled
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Địa chỉ email của bạn được sử dụng để xác thực và không thể
                thay đổi.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type='tel'
                  placeholder='0123456789'
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Số điện thoại liên hệ của bạn (10-11 chữ số).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Ngày sinh</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>
                Ngày sinh của bạn để xác định danh tính.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isMale'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn giới tính của bạn' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='true'>Nam</SelectItem>
                  <SelectItem value='false'>Nữ</SelectItem>
                  <SelectItem value='null'>Không muốn tiết lộ</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Thông tin giới tính của bạn (tùy chọn).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full sm:w-auto'>
          Cập nhật tài khoản
        </Button>
      </form>
    </Form>
  )
}
