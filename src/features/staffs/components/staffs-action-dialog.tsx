import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { DatePickerInput } from '@/components/ui/date-picker-input'
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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { staffRoles, genderOptions } from '../data/data'
import { type Staff } from '../data/schema'
import { useCreateStaff, useUpdateStaff } from '../data/use-staffs'

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự.')
      .max(100, 'Họ và tên không được vượt quá 100 ký tự.'),
    email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.'),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    role: z.enum(['SUPER_ADMIN', 'ADMIN'], {
      required_error: 'Vui lòng chọn vai trò.',
    }),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, 'Số điện thoại không hợp lệ')
      .optional()
      .or(z.literal('')),
    isMale: z.string().optional(),
    dateOfBirth: z.string().optional(),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Vui lòng nhập mật khẩu.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Mật khẩu phải có ít nhất 8 ký tự.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      
      if (isEdit && !password) return true
      return /[A-Z]/.test(password)
    },
    {
      message: 'Mật khẩu phải chứa ít nhất một chữ hoa.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Mật khẩu phải chứa ít nhất một chữ thường.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Mật khẩu phải chứa ít nhất một chữ số.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Mật khẩu không khớp.",
      path: ['confirmPassword'],
    }
  )
type StaffForm = z.infer<typeof formSchema>

type StaffActionDialogProps = {
  currentRow?: Staff
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: StaffActionDialogProps) {
  const isEdit = !!currentRow

  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()

  const form = useForm<StaffForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          fullName: currentRow.fullName,
          email: currentRow.email,
          role: currentRow.role,
          phone: currentRow.phone || '',
          isMale: currentRow.isMale !== null ? String(currentRow.isMale) : '',
          dateOfBirth: currentRow.dateOfBirth
            ? new Date(currentRow.dateOfBirth).toISOString().split('T')[0]
            : '',
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'ADMIN',
          phone: '',
          isMale: '',
          dateOfBirth: '',
          isEdit,
        },
  })

  const onSubmit = async (values: StaffForm) => {
    try {
      
      const apiData = {
        fullName: values.fullName,
        email: values.email.toLowerCase(),
        role: values.role,
        phone: values.phone || undefined,
        isMale: values.isMale ? values.isMale === 'true' : undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        ...(values.password && { password: values.password }),
      }

      if (isEdit && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          data: apiData,
        })
      } else {
        if (!values.password) {
          form.setError('password', { message: 'Vui lòng nhập mật khẩu' })
          return
        }
        await createMutation.mutateAsync({
          ...apiData,
          password: values.password,
        })
      }

      form.reset()
      onOpenChange(false)
    } catch (error) {
      
      console.error('Lưu nhân viên thất bại:', error)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật chi tiết nhân viên tại đây. '
              : 'Tạo tài khoản nhân viên mới tại đây. '}
            Nhấp vào lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='staff-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Smith'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.smith@example.com'
                        className='col-span-4'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Vai trò</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Chọn vai trò'
                      className='col-span-4'
                      items={staffRoles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+1234567890'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isMale'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Giới tính
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Chọn giới tính'
                      className='col-span-4'
                      items={genderOptions.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Ngày sinh
                    </FormLabel>
                    <FormControl>
                      <DatePickerInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Chọn ngày sinh'
                        className='col-span-4'
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={
                          isEdit
                            ? 'Để trống để giữ nguyên'
                            : 'e.g., SecureP@ss123'
                        }
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder={
                          isEdit
                            ? 'Để trống để giữ nguyên'
                            : 'e.g., SecureP@ss123'
                        }
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='staff-form' disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
