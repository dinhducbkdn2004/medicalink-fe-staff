
import type { UseFormReturn } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
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
          Chức danh học thuật & Vị trí
        </h3>
        <div className='space-y-4'>
        {}
        {}
        <FormField
          control={form.control}
          name='position'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Vị trí / Chức vụ'
                  description='Vị trí chuyên môn hiện tại'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='ví dụ: Trưởng khoa Tim mạch'
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

