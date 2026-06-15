
import type { UseFormReturn } from 'react-hook-form'
import { Stethoscope } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import type { UpdateDoctorProfileFormData } from '../../types'
import { RichTextEditor } from '../rich-text-editor'
import { ArrayInputField } from '../array-input-field'

interface ProfessionalTabProps {
  form: UseFormReturn<UpdateDoctorProfileFormData>
  accessToken: string
}

export function ProfessionalTab({
  form,
  accessToken,
}: Readonly<ProfessionalTabProps>) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
          <Stethoscope className='text-primary h-4 w-4' />
          Professional Information
        </h3>
        <div className='space-y-4'>
          {}
          <FormField
            control={form.control}
            name='introduction'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Introduction
                </FormLabel>
                <FormDescription className='mb-2 text-xs'>
                  Professional background and overview
                </FormDescription>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    accessToken={accessToken}
                    placeholder='Write a professional introduction...'
                    toolbarOptions='basic'
                    enableSyntax={true}
                    enableFormula={true}
                    enableImageUpload={true}
                    enableVideoUpload={true}
                    size='compact'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name='expertise'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArrayInputField
                    label='Medical Expertise'
                    description='Specialized areas of medical knowledge'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='e.g., General Cardiology'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name='procedures'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArrayInputField
                    label='Procedures'
                    description='Medical procedures performed'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='e.g., Echocardiogram'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name='conditions'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArrayInputField
                    label='Conditions Treated'
                    description='Medical conditions and diseases treated'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='e.g., Hypertension'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name='symptoms'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArrayInputField
                    label='Symptoms Evaluated'
                    description='Common symptoms evaluated and diagnosed'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='e.g., Chest Pain'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name='patientGroups'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArrayInputField
                    label='Patient Groups'
                    description='Specific patient demographics treated'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='e.g., Adults, Seniors'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
