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
    .min(1, 'Please enter your full name')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  isMale: z.enum(['true', 'false', 'null']).optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { user, profile } = useAuth()
  const currentUser = profile || user

  const form = useForm({
    // @ts-expect-error - Zod v4 compatibility issue with @hookform/resolvers
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
    // Validate phone number if provided
    if (data.phone && data.phone.trim() !== '') {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(data.phone)) {
        toast.error('Phone number must be 10-11 digits')
        return
      }
    }

    // TODO: Implement update profile API
    toast.success('Profile updated successfully')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your full name' {...field} />
              </FormControl>
              <FormDescription>
                This is your display name shown across the platform.
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
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='your.email@example.com'
                  disabled
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your email address is used for authentication and cannot be
                changed.
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
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  type='tel'
                  placeholder='0123456789'
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Your contact phone number (10-11 digits).
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
              <FormLabel>Date of birth</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>
                Your date of birth for identification purposes.
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
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select your gender' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='true'>Male</SelectItem>
                  <SelectItem value='false'>Female</SelectItem>
                  <SelectItem value='null'>Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your gender information (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full sm:w-auto'>
          Update account
        </Button>
      </form>
    </Form>
  )
}
