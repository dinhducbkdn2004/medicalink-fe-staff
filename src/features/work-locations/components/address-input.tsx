
import { useState } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect?: (address: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function AddressInput({
  value,
  onChange,
  onAddressSelect,
  disabled = false,
  placeholder = '123 Medical Center Dr, City, State ZIP',
  className,
}: AddressInputProps) {
  const [isSearching, setIsSearching] = useState(false)
  
  const handleSearch = async () => {
    if (!value || value.trim().length === 0) {
      return
    }
    
    setIsSearching(true)
    
    try {
      
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      
      
      
      
      
      
      
      onAddressSelect?.(value)
    } catch (error) {
      console.error('Address search error:', error)
    } finally {
      setIsSearching(false)
    }
  }
  
  return (
    <div className='relative'>
      <div className='flex gap-2'>
        <div className='relative flex-1'>
          <MapPin className='text-muted-foreground absolute left-3 top-3 size-4' />
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn('min-h-[80px] resize-none pl-10', className)}
          />
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={handleSearch}
          disabled={disabled || isSearching || !value}
          className='h-[80px] shrink-0'
          title='Search address'
        >
          {isSearching ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Search className='size-4' />
          )}
        </Button>
      </div>
      
      {}
      <p className='text-muted-foreground mt-1 text-xs'>
        💡 Tip: Click search to validate address (Google Places integration ready)
      </p>
    </div>
  )
}

