
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
          Đào tạo & Kinh nghiệm
        </h3>
        <div className='space-y-4'>
        <FormField
          control={form.control}
          name='education'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ArrayInputField
                  label='Học vấn & Đào tạo'
                  description='Nền tảng học vấn, bằng cấp và đào tạo chính quy'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='ví dụ: 2005-2009: Trường Y Dược'
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
                  label='Kinh nghiệm làm việc'
                  description='Lịch sử công việc và mốc thời gian sự nghiệp'
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='ví dụ: 2015-2017: Bác sĩ điều trị tại...'
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

