/**
 * Locations Tab Component
 * Specialties & Work Locations section
 */
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
          Specialties & Locations
        </h3>
        <div className='space-y-4'>
        {/* Specialties */}
        <FormField
          control={form.control}
          name='specialtyIds'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelectField
                  label='Specialties'
                  description='Medical specialties and areas of expertise'
                  options={specialties.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='Select specialties'
                  emptyText='No specialties available'
                  loading={loadingSpecialties}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Work Locations */}
        <FormField
          control={form.control}
          name='locationIds'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelectField
                  label='Work Locations'
                  description='Hospitals and clinics where the doctor practices'
                  options={workLocations.map((l) => ({
                    value: l.id,
                    label: l.name,
                  }))}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder='Select work locations'
                  emptyText='No locations available'
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

