import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStaffs } from './staffs-provider'

export function StaffsPrimaryButtons() {
  const { setOpen } = useStaffs()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Staff</span> <UserPlus size={18} />
    </Button>
  )
}


