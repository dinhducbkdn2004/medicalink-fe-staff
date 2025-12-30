
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePatients } from './patients-provider'

export function PatientsPrimaryButtons() {
  const { setOpen } = usePatients()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('create')}>
        <Plus className='mr-2 h-4 w-4' />
        Add Patient
      </Button>
    </div>
  )
}
