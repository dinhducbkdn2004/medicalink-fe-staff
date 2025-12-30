
import {
  RESOURCES,
  ACTIONS,
  type Resource,
  type Action,
} from '@/api/types/permission.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ResourceActionSelectorProps = {
  selectedResource?: Resource
  selectedActions: Action[]
  onResourceChange: (resource: Resource) => void
  onActionsChange: (actions: Action[]) => void
  disabled?: boolean
}

export function ResourceActionSelector({
  selectedResource,
  selectedActions,
  onResourceChange,
  onActionsChange,
  disabled = false,
}: ResourceActionSelectorProps) {
  const handleActionToggle = (action: Action) => {
    if (selectedActions.includes(action)) {
      onActionsChange(selectedActions.filter((a) => a !== action))
    } else {
      onActionsChange([...selectedActions, action])
    }
  }

  return (
    <div className='space-y-4'>
      {}
      <div className='space-y-2'>
        <Label>Resource</Label>
        <Select
          value={selectedResource}
          onValueChange={(value) => onResourceChange(value as Resource)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a resource' />
          </SelectTrigger>
          <SelectContent>
            {RESOURCES.map((resource) => (
              <SelectItem key={resource} value={resource}>
                <span className='capitalize'>{resource}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {}
      {selectedResource && (
        <div className='space-y-2'>
          <Label>Actions</Label>
          <div className='space-y-2 rounded-md border p-4'>
            {ACTIONS.map((action) => (
              <div key={action} className='flex items-center space-x-2'>
                <Checkbox
                  id={`action-${action}`}
                  checked={selectedActions.includes(action)}
                  onCheckedChange={() => handleActionToggle(action)}
                  disabled={disabled}
                />
                <label
                  htmlFor={`action-${action}`}
                  className='text-sm leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {action}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
