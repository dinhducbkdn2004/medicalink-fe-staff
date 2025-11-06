/**
 * Group Primary Buttons
 * Action buttons for group management
 */
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGroupManager } from './group-manager-provider'

export function GroupPrimaryButtons() {
  const { setOpen, setCurrentGroup } = useGroupManager()

  const handleCreate = () => {
    setCurrentGroup(null)
    setOpen('create')
  }

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={handleCreate}>
        <Plus className='mr-2 h-4 w-4' />
        Create Group
      </Button>
    </div>
  )
}
