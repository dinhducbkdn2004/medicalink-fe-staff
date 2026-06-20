
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { getUserTimezone } from '@/lib/timezones'
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
import { type WorkLocation } from '../data/schema'
import {
  useCreateWorkLocation,
  useUpdateWorkLocation,
} from '../data/use-work-locations'
import { GoogleMapsInput } from './google-maps-input'
import { TimezoneCombobox } from './timezone-combobox'





const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(160, 'Tên không được vượt quá 160 ký tự'),
  address: z
    .string()
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(32, 'Số điện thoại không được vượt quá 32 ký tự')
    .optional()
    .or(z.literal('')),
  timezone: z
    .string()
    .max(64, 'Múi giờ không được vượt quá 64 ký tự')
    .optional()
    .or(z.literal('')),
  googleMapUrl: z
    .string()
    .url('Phải là một URL hợp lệ')
    .optional()
    .or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface WorkLocationsActionDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow?: WorkLocation
}





export function WorkLocationsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: WorkLocationsActionDialogProps) {
  const isEditMode = !!currentRow
  const createMutation = useCreateWorkLocation()
  const updateMutation = useUpdateWorkLocation()

  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      timezone: getUserTimezone(), 
      googleMapUrl: '',
    },
  })

  
  const addressValue = useWatch({
    control: form.control,
    name: 'address',
  })

  
  useEffect(() => {
    if (open && isEditMode && currentRow) {
      form.reset({
        name: currentRow.name,
        address: currentRow.address || '',
        phone: currentRow.phone || '',
        timezone: currentRow.timezone || getUserTimezone(),
        googleMapUrl: currentRow.googleMapUrl || '',
      })
    } else if (open && !isEditMode) {
      form.reset({
        name: '',
        address: '',
        phone: '',
        timezone: getUserTimezone(), 
        googleMapUrl: '',
      })
    }
  }, [open, isEditMode, currentRow, form])

  
  const onSubmit = async (values: FormValues) => {
    try {
      const data = {
        name: values.name,
        address: values.address || undefined,
        phone: values.phone || undefined,
        timezone: values.timezone || undefined,
        googleMapUrl: values.googleMapUrl || undefined,
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
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Chỉnh sửa địa điểm làm việc' : 'Tạo địa điểm làm việc mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin địa điểm làm việc dưới đây.'
              : 'Điền thông tin để tạo địa điểm làm việc mới.'}
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
                    Tên địa điểm <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='ví dụ: Bệnh viện trung tâm'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='123 Đường Trung tâm Y tế, Thành phố, Tỉnh/Thành phố ZIP'
                      className='min-h-[80px] resize-none'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='+1-212-555-0100'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='timezone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Múi giờ</FormLabel>
                  <FormControl>
                    <TimezoneCombobox
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name='googleMapUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <GoogleMapsInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      address={addressValue}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn tùy chọn đến vị trí trên Google Maps (có thể tự động tạo từ địa chỉ)
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
