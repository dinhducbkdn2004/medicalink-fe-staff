
import type { UseFormReturn } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { MultiSelectField } from '../multi-select-field'
import type { UpdateDoctorProfileFormData } from '../../types'
import type { Specialty } from '@/api/types/specialty.types'
import type { WorkLocation } from '@/api/types/work-location.types'

interface LocationsTabProps {
  form: UseFormReturn<UpdateDoctorProfileFormData>
  specialties: Specialty[]
  workLocations: WorkLocation[]
  loadingSpecialties: boolean
  loadingLocations: boolean
}

export function LocationsTab({
  form,
  specialties,
  workLocations,
  loadingSpecialties,
  loadingLocations,
}: Readonly<LocationsTabProps>) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-4 flex items-center gap-2 text-base font-semibold'>
          <MapPin className='text-primary h-4 w-4' />
          Chuyên khoa & Nơi làm việc
        </h3>
        <div className='space-y-4'>
        {}
        <FormField
          control={form.control}
          name='specialtyIds'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelectField
                  label='Chuyên khoa'
                  description='Các chuyên khoa y tế và lĩnh vực chuyên môn'
                  options={specialties.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='Chọn chuyên khoa'
                  emptyText='Không có chuyên khoa nào'
                  loading={loadingSpecialties}
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
          name='locationIds'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelectField
                  label='Nơi làm việc'
                  description='Các bệnh viện và phòng khám nơi bác sĩ hành nghề'
                  options={workLocations.map((l) => ({
                    value: l.id,
                    label: l.name,
                  }))}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='Chọn nơi làm việc'
                  emptyText='Không có nơi làm việc nào'
                  loading={loadingLocations}
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

