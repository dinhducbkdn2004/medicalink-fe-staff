/**
 * Specialty Cell Component
 * Renders the specialty name, fetching it if necessary
 */
import type { Specialty } from '@/api/services'
import { Badge } from '@/components/ui/badge'
import { useSpecialties } from '../data/use-specialties'

interface SpecialtyCellProps {
  specialtyId?: string | null
  specialty?: Specialty | null
}

export function SpecialtyCell({ specialtyId, specialty }: SpecialtyCellProps) {
  // If specialty object is provided, use it directly
  if (specialty) {
    return (
      <Badge variant='outline' className='font-normal'>
        {specialty.name}
      </Badge>
    )
  }

  // If no ID, show hyphen
  if (!specialtyId) {
    return <span className='text-muted-foreground text-sm'>-</span>
  }

  // Otherwise, fetch/lookup
  return <SpecialtyLookup id={specialtyId} />
}

function SpecialtyLookup({ id }: { id: string }) {
  const { data } = useSpecialties({ limit: 100 })
  const specialties = data?.data || []
  const found = specialties.find((s) => s.id === id)

  if (!found) {
    return <span className='text-muted-foreground text-sm'>-</span>
  }

  return (
    <Badge variant='outline' className='font-normal'>
      {found.name}
    </Badge>
  )
}
