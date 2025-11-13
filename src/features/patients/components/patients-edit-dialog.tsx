/**
 * Edit Patient Dialog
 * Modal for updating an existing patient record
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
import { useUpdatePatient } from '../data/use-patients'
import { updatePatientSchema, type UpdatePatientFormData } from '../types'
import { usePatients } from './patients-provider'

export function PatientsEditDialog() {
  const { open, setOpen, currentRow } = usePatients()
  const { mutate: updatePatient, isPending } = useUpdatePatient()

  const form = useForm<UpdatePatientFormData>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      isMale: undefined,
      dateOfBirth: '',
      addressLine: '',
      district: '',
      province: '',
    },
  })

  useEffect(() => {
    if (currentRow && open === 'edit') {
      form.reset({
        fullName: currentRow.fullName || '',
        email: currentRow.email || '',
        phone: currentRow.phone || '',
        isMale: currentRow.isMale,
        dateOfBirth: currentRow.dateOfBirth
          ? new Date(currentRow.dateOfBirth).toISOString().split('T')[0]
          : '',
        addressLine: currentRow.addressLine || '',
        district: currentRow.district || '',
        province: currentRow.province || '',
      })
    }
  }, [currentRow, open, form])

  const onSubmit = (data: UpdatePatientFormData) => {
    if (!currentRow) return

    // Clean empty strings to undefined
    const cleanedData = {
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      addressLine: data.addressLine || undefined,
      district: data.district || undefined,
      province: data.province || undefined,
    }

    updatePatient(
      { id: currentRow.id, data: cleanedData },
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
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update patient information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john.doe@example.com'
                        {...field}
                      />
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
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='isMale'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'true')
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

            <FormField
              control={form.control}
              name='addressLine'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Main Street, Apt 4B' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='district'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder='Manhattan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder='New York' {...field} />
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
                {isPending ? 'Updating...' : 'Update Patient'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
