/**
 * Office Hours Primary Action Buttons
 * Main action buttons for the office hours page
 */
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOfficeHoursContext } from './office-hours-provider'

export function OfficeHoursPrimaryButtons() {
  const { setOpen, setCurrentRow } = useOfficeHoursContext()

  const handleAdd = () => {
    setCurrentRow(null)
    setOpen('add')
  }

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={handleAdd} size='sm' className='h-9'>
        <Plus className='mr-2 size-4' />
        Add Office Hours
      </Button>
    </div>
  )
}
