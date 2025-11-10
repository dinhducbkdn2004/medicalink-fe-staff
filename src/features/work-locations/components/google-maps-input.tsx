/**
 * Google Maps URL Input Component
 * Input with "Open Map" button and auto-generate functionality
 */
import { ExternalLink, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  generateGoogleMapsUrl,
  openGoogleMaps,
} from '@/lib/location-utils'

interface GoogleMapsInputProps {
  value: string
  onChange: (value: string) => void
  address?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function GoogleMapsInput({
  value,
  onChange,
  address,
  disabled = false,
  placeholder = 'https://maps.google.com/?q=Hospital+Name',
  className,
}: GoogleMapsInputProps) {
  const handleAutoGenerate = () => {
    if (!address || address.trim().length === 0) {
      return
    }

    const generatedUrl = generateGoogleMapsUrl(address)
    onChange(generatedUrl)
  }

  const handleOpenMap = () => {
    if (!value) return
    openGoogleMaps(value)
  }

  const canAutoGenerate = address && address.trim().length > 0 && !value

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          type='url'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('flex-1', className)}
        />

        {/* Auto-generate button */}
        {canAutoGenerate && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleAutoGenerate}
            disabled={disabled}
            title='Auto-generate from address'
            className='shrink-0'
          >
            <Wand2 className='size-4' />
          </Button>
        )}

        {/* Open map button */}
        {value && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleOpenMap}
            disabled={disabled}
            title='Open in Google Maps'
            className='shrink-0'
          >
            <ExternalLink className='size-4' />
          </Button>
        )}
      </div>

    </div>
  )
}

