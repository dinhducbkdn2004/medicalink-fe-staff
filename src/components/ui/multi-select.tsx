import * as React from 'react'
import { X, Check, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  label: string
  value: string
  subtitle?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  isLoading?: boolean
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = 'Select items...',
  emptyMessage = 'No item found.',
  searchPlaceholder = 'Search...',
  disabled = false,
  className,
  isLoading = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (itemValue: string) => {
    onChange(selected.filter((i) => i !== itemValue))
  }

  const selectedOptions = options.filter((o) => selected.includes(o.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between hover:bg-transparent px-3 py-2 h-auto min-h-10',
            className
          )}
          disabled={disabled || isLoading}
          onClick={() => setOpen(!open)}
        >
          <div className='flex flex-wrap gap-1'>
            {selectedOptions.length === 0 && (
              <span className='text-muted-foreground font-normal'>
                {placeholder}
              </span>
            )}
            {selectedOptions.map((item) => (
              <Badge
                variant='secondary'
                key={item.value}
                className='mr-1 mb-1 font-normal'
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnselect(item.value)
                }}
              >
                {item.label}
                <div
                  className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUnselect(item.value)
                  }}
                >
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </div>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className='max-h-64 overflow-auto'>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(
                        isSelected
                          ? selected.filter((item) => item !== option.value)
                          : [...selected, option.value]
                      )
                      // Do not close popover on multiple select
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    <div className='flex flex-col'>
                      <span>{option.label}</span>
                      {option.subtitle && (
                        <span className='text-muted-foreground text-xs'>
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
