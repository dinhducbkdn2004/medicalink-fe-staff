
import type { UseFormReturn } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { ArrayInputField } from '../array-input-field'
import type { UpdateDoctorProfileFormData } from '../../types'

interface EducationTabProps {
  form: UseFormReturn<UpdateDoctorProfileFormData>
}

export function EducationTab({ form }: Readonly<EducationTabProps>) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
          <GraduationCap className='text-primary h-4 w-4' />
          Training & Experience
        </h3>
        <div className='space-y-4'>
        {}
        <FormField
          control={form.control}
          name='trainingProcess'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Training Process'
                  description='Educational background and formal training'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='e.g., 2005-2009: Medical School - Harvard'
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
          name='experience'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Professional Experience'
                  description='Work history and career timeline'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='e.g., 2015-2017: Attending Physician at...'
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
          name='memberships'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Professional Memberships'
                  description='Organizations and professional associations'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='e.g., American Heart Association'
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
          name='awards'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Awards & Recognition'
                  description='Honors and achievements'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='e.g., Best Doctor Award 2023'
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

