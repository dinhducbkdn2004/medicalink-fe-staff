/**
 * Edit Doctor Account Dialog
 * Modal for editing doctor account information
 */
import { useEffect } from 'react'
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
import { useUpdateDoctor } from '../data/use-doctors'
import {
  updateDoctorAccountSchema,
  type UpdateDoctorAccountFormData,
} from '../types'
import { useDoctors } from './doctors-provider'

export function DoctorsEditDialog() {
  const { open, setOpen, currentRow } = useDoctors()
  const { mutate: updateDoctor, isPending } = useUpdateDoctor()

  const form = useForm<UpdateDoctorAccountFormData>({
    resolver: zodResolver(updateDoctorAccountSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      isMale: undefined,
      dateOfBirth: '',
    },
  })

  useEffect(() => {
    if (open === 'edit' && currentRow) {
      form.reset({
        fullName: currentRow.fullName || '',
        email: currentRow.email || '',
        password: '',
        phone: currentRow.phone || '',
        isMale: currentRow.isMale,
        dateOfBirth: currentRow.dateOfBirth
          ? new Date(currentRow.dateOfBirth).toISOString().split('T')[0]
          : '',
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: UpdateDoctorAccountFormData) => {
    if (!currentRow) return

    // Remove empty/unchanged fields
    const updateData: UpdateDoctorAccountFormData = {}
    if (data.fullName && data.fullName !== currentRow.fullName) {
      updateData.fullName = data.fullName
    }
    if (data.email && data.email !== currentRow.email) {
      updateData.email = data.email
    }
    if (data.password) {
      updateData.password = data.password
    }
    if (data.phone && data.phone !== currentRow.phone) {
      updateData.phone = data.phone
    }
    if (data.isMale !== undefined && data.isMale !== currentRow.isMale) {
      updateData.isMale = data.isMale
    }
    if (data.dateOfBirth) {
      updateData.dateOfBirth = data.dateOfBirth
    }

    updateDoctor(
      { id: currentRow.id, data: updateData },
      {
        onSuccess: () => {
          form.reset()
          setOpen(null)
        },
      }
    )
  }

  const handleClose = () => {
    form.reset()
    setOpen(null)
  }

  return (
    <Dialog
      open={open === 'edit'}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Doctor Account</DialogTitle>
          <DialogDescription>
            Update doctor account information. Leave password empty to keep
            unchanged.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Dr. John Smith' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john.smith@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (optional)</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder='+1234567890' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='isMale'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'true' ? true : false)
                      }
                      value={
                        field.value === undefined ? '' : String(field.value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='true'>Male</SelectItem>
                        <SelectItem value='false'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
