/**
 * Academic Tab Component
 * Academic Titles & Positions section
 */
import type { UseFormReturn } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ArrayInputField } from '../array-input-field'
import type { UpdateDoctorProfileFormData } from '../../types'

interface AcademicTabProps {
  form: UseFormReturn<UpdateDoctorProfileFormData>
}

export function AcademicTab({ form }: Readonly<AcademicTabProps>) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
          <Briefcase className='text-primary h-4 w-4' />
          Academic Titles & Positions
        </h3>
        <div className='space-y-4'>
        {/* Academic Degree */}
        <FormField
          control={form.control}
          name='degree'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-2 text-sm'>
                Academic Degree
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g., MD, PhD, FACC'
                  {...field}
                  value={field.value || ''}
                  className='h-9'
                />
              </FormControl>
              <FormDescription className='text-xs'>
                Academic degrees and professional certifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Positions */}
        <FormField
          control={form.control}
          name='position'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Positions'
                  description='Current professional positions'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='e.g., Chief of Cardiology'
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

