/**
 * Doctors Primary Action Buttons
 * Main action buttons for doctor management page
 */
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDoctors } from './doctors-provider'

export function DoctorsPrimaryButtons() {
  const { setOpen } = useDoctors()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('create')}>
        <Plus className='mr-2 h-4 w-4' />
        Add Doctor
      </Button>
    </div>
  )
}
