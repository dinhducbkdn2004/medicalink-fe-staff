
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpecialties } from './specialties-provider'

export function SpecialtiesPrimaryButtons() {
  const { setOpen, setCurrentRow } = useSpecialties()

  return (
    <div className='flex items-center gap-2'>
      <Button
        onClick={() => {
          setCurrentRow(null)
          setOpen('add')
        }}
        size='sm'
        className='h-8 gap-1'
      >
        <Plus className='size-3.5' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Add Specialty
        </span>
      </Button>
    </div>
  )
}

