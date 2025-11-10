/**
 * Timezone Combobox Component
 * Searchable select for timezones with regional grouping
 */
import { useState } from 'react'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import {
  timezoneData,
  getGroupedTimezones,
  formatTimezone,
  type TimezoneOption,
} from '@/lib/timezones'

interface TimezoneComboboxProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function TimezoneCombobox({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select timezone...',
}: TimezoneComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  const groupedTimezones = getGroupedTimezones()
  
  // Filter timezones based on search
  const filteredTimezones = search
    ? timezoneData.filter(
        (tz) =>
          tz.label.toLowerCase().includes(search.toLowerCase()) ||
          tz.value.toLowerCase().includes(search.toLowerCase()) ||
          tz.gmtLabel.toLowerCase().includes(search.toLowerCase()) ||
          tz.region.toLowerCase().includes(search.toLowerCase())
      )
    : null
  
  // Get display value
  const displayValue = value ? formatTimezone(value) : placeholder
  
  const handleSelect = (timezone: TimezoneOption) => {
    onChange(timezone.value)
    setOpen(false)
    setSearch('')
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className='w-full justify-between font-normal'
        >
          <div className='flex items-center gap-2'>
            <Globe className='size-4 shrink-0 opacity-50' />
            <span className={cn(!value && 'text-muted-foreground')}>
              {displayValue}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput
            placeholder='Search timezone...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            
            {filteredTimezones ? (
              // Show filtered results (ungrouped)
              <CommandGroup>
                {filteredTimezones.map((tz) => (
                  <CommandItem
                    key={tz.value}
                    value={tz.value}
                    onSelect={() => handleSelect(tz)}
                    className='cursor-pointer'
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        value === tz.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className='flex flex-1 items-center justify-between'>
                      <span>{tz.label}</span>
                      <span className='text-muted-foreground ml-2 text-xs'>
                        {tz.gmtLabel}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              // Show grouped results
              <>
                {Object.entries(groupedTimezones).map(([region, timezones]) => (
                  <CommandGroup key={region} heading={region}>
                    {timezones.map((tz) => (
                      <CommandItem
                        key={tz.value}
                        value={tz.value}
                        onSelect={() => handleSelect(tz)}
                        className='cursor-pointer'
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4',
                            value === tz.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className='flex flex-1 items-center justify-between'>
                          <span>{tz.label}</span>
                          <span className='text-muted-foreground ml-2 text-xs'>
                            {tz.gmtLabel}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

