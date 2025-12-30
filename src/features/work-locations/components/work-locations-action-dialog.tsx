
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
    .min(2, 'Name must be at least 2 characters')
    .max(160, 'Name must be at most 160 characters'),
  address: z
    .string()
    .max(255, 'Address must be at most 255 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(32, 'Phone must be at most 32 characters')
    .optional()
    .or(z.literal('')),
  timezone: z
    .string()
    .max(64, 'Timezone must be at most 64 characters')
    .optional()
    .or(z.literal('')),
  googleMapUrl: z
    .string()
    .url('Must be a valid URL')
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
            {isEditMode ? 'Edit Work Location' : 'Create New Work Location'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the work location information below.'
              : 'Fill in the information to create a new work location.'}
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
                    Location Name <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Main Hospital'
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='123 Medical Center Dr, City, State ZIP'
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
                  <FormLabel>Phone Number</FormLabel>
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
                  <FormLabel>Timezone</FormLabel>
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
                    Optional link to Google Maps location (can auto-generate
                    from address)
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
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
