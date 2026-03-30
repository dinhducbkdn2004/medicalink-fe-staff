import { useMemo } from 'react'
import type { Permission } from '@/api/types/permission.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  groupCatalogByModule,
  formatResourceLabel,
} from '../utils/permission-catalog'

type ResourceActionSelectorProps = {
  catalog: Permission[]
  selectedResource?: string
  selectedActions: string[]
  onResourceChange: (resource: string) => void
  onActionsChange: (actions: string[]) => void
  disabled?: boolean
}

export function ResourceActionSelector({
  catalog,
  selectedResource,
  selectedActions,
  onResourceChange,
  onActionsChange,
  disabled = false,
}: ResourceActionSelectorProps) {
  const actionsForResource = useMemo(() => {
    if (!selectedResource) return []
    return catalog
      .filter((p) => p.resource === selectedResource)
      .map((p) => p.action)
      .sort((a, b) => a.localeCompare(b))
  }, [catalog, selectedResource])

  const modules = useMemo(() => groupCatalogByModule(catalog), [catalog])

  const handleActionToggle = (action: string) => {
    if (selectedActions.includes(action)) {
      onActionsChange(selectedActions.filter((a) => a !== action))
    } else {
      onActionsChange([...selectedActions, action])
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Resource</Label>
        <Select
          value={selectedResource}
          onValueChange={onResourceChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select resource' />
          </SelectTrigger>
          <SelectContent className='max-h-72'>
            {modules.map((mod) => (
              <div key={mod.moduleId}>
                <div className='text-muted-foreground px-2 py-1.5 text-[11px] font-semibold tracking-wide uppercase'>
                  {mod.meta.title}
                </div>
                {mod.resources.map(({ resource }) => (
                  <SelectItem key={resource} value={resource}>
                    <span className='capitalize'>{formatResourceLabel(resource)}</span>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedResource && (
        <div className='space-y-2'>
          <Label>Action</Label>
          <div className='space-y-2 rounded-md border p-4'>
            {actionsForResource.map((action) => (
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
            {actionsForResource.length === 0 && (
              <p className='text-muted-foreground text-xs'>
                No actions in the catalog for this resource.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
