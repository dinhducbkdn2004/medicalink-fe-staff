/**
 * Array Input Field Component
 * Allows users to add/edit/remove string array items dynamically
 */
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ArrayInputFieldProps {
  label: string
  description?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function ArrayInputField({
  label,
  description,
  value,
  onChange,
  placeholder = 'Enter text',
  disabled = false,
}: ArrayInputFieldProps) {
  const handleAdd = () => {
    onChange([...value, ''])
  }

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleChange = (index: number, text: string) => {
    const newValue = [...value]
    newValue[index] = text
    onChange(newValue)
  }

  return (
    <div className='space-y-3'>
      <div>
        <Label>{label}</Label>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>

      <div className='space-y-2'>
        {value.map((item, index) => (
          <div key={index} className='flex gap-2'>
            <Input
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => handleRemove(index)}
              disabled={disabled}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}

        {value.length === 0 && (
          <p className='text-muted-foreground text-sm italic'>
            No items added yet.
          </p>
        )}
      </div>

      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={handleAdd}
        disabled={disabled}
        className='w-full'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add {label}
      </Button>
    </div>
  )
}

