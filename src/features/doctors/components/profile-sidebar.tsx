import type { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import type { UpdateDoctorProfileFormData } from '../types'
import { ImageUploadField } from './image-upload-field'

interface ProfileSidebarProps {
  form: UseFormReturn<UpdateDoctorProfileFormData>
  doctor: {
    fullName: string
    email: string
    phone?: string
    dateOfBirth?: string
    isMale?: boolean
    isActive?: boolean
    avatarUrl?: string
  }
  accessToken: string
}

export function ProfileSidebar({
  form,
  accessToken,
}: Readonly<ProfileSidebarProps>) {
  return (
    <div className='space-y-4'>
      {}
      <Card className='overflow-hidden'>
        <CardContent className='space-y-4 p-4'>
          {}
          <FormField
            control={form.control}
            name='avatarUrl'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploadField
                    label='Avatar'
                    description='Square image for listings'
                    value={field.value}
                    onChange={field.onChange}
                    accessToken={accessToken}
                    aspectRatio='square'
                    compact
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {}
          <FormField
            control={form.control}
            name='portrait'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploadField
                    label='Portrait'
                    description='Rectangular header photo'
                    value={field.value}
                    onChange={field.onChange}
                    accessToken={accessToken}
                    aspectRatio='portrait'
                    compact
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
