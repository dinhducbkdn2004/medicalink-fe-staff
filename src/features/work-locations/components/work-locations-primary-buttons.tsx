/**
 * Work Locations Primary Buttons
 * Action buttons for work locations management
 */
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkLocations } from './work-locations-provider'

export function WorkLocationsPrimaryButtons() {
  const { setOpen } = useWorkLocations()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('add')} size='sm'>
        <Plus className='mr-2 size-4' />
        Add Location
      </Button>
    </div>
  )
}

