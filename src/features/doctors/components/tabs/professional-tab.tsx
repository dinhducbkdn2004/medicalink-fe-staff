
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
          Thông tin Chuyên môn
        </h3>
        <div className='space-y-4'>
          {}
          <FormField
            control={form.control}
            name='introduction'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Giới thiệu
                </FormLabel>
                <FormDescription className='mb-2 text-xs'>
                  Tổng quan và nền tảng chuyên môn
                </FormDescription>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    accessToken={accessToken}
                    placeholder='Viết phần giới thiệu chuyên môn...'
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
                    label='Chuyên môn y tế'
                    description='Lĩnh vực chuyên môn sâu'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='ví dụ: Tim mạch tổng quát'
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
                    label='Thủ thuật / Phẫu thuật'
                    description='Các thủ thuật y tế đã thực hiện'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='ví dụ: Siêu âm tim'
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
                    label='Bệnh lý Điều trị'
                    description='Các tình trạng y tế và bệnh lý được điều trị'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='ví dụ: Cao huyết áp'
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
                    label='Triệu chứng Đánh giá'
                    description='Các triệu chứng phổ biến được đánh giá và chẩn đoán'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='ví dụ: Đau ngực'
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
                    label='Nhóm Bệnh nhân'
                    description='Thông tin nhân khẩu học cụ thể của bệnh nhân được điều trị'
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder='ví dụ: Người lớn, Người cao tuổi'
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
