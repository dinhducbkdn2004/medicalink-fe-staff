
import type { Specialty } from '@/api/services'
import { Badge } from '@/components/ui/badge'
import { usePublicSpecialties } from '../data/use-specialties'

interface SpecialtyCellProps {
  specialtyId?: string | null
  specialty?: Specialty | null
}

export function SpecialtyCell({ specialtyId, specialty }: SpecialtyCellProps) {
  
  if (specialty) {
    return (
      <Badge variant='outline' className='font-normal'>
        {specialty.name}
      </Badge>
    )
  }

  
  if (!specialtyId) {
    return <span className='text-muted-foreground text-sm'>-</span>
  }

  
  return <SpecialtyLookup id={specialtyId} />
}

function SpecialtyLookup({ id }: { id: string }) {
  const { data } = usePublicSpecialties({ limit: 100 })
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
