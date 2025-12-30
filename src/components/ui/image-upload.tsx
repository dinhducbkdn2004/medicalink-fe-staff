import { useState, useRef } from 'react'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageUpload } from '@/hooks/use-image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
  const { uploadImage, isUploading } = useImageUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (error) {
      console.error('Failed to upload image', error)
      
    } finally {
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {!value ? (
        <div
          className={cn(
            'border-muted-foreground/25 hover:bg-muted/50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            dragActive && 'border-primary bg-muted/50',
            (disabled || isUploading) && 'pointer-events-none opacity-60'
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={async (e) => {
            e.preventDefault()
            setDragActive(false)
            const file = e.dataTransfer.files?.[0]
            if (file) {
              await handleUpload(file)
            }
          }}
        >
          <div className='flex flex-col items-center gap-2 text-center'>
            {isUploading ? (
              <Loader2 className='text-muted-foreground size-8 animate-spin' />
            ) : (
              <Upload className='text-muted-foreground size-8' />
            )}
            <div className='text-sm'>
              <span className='font-semibold'>Click to upload</span> or drag and
              drop
            </div>
            <p className='text-muted-foreground text-xs'>
              SVG, PNG, JPG or GIF (max. 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className='relative aspect-square w-40 overflow-hidden rounded-lg border'>
          <img
            src={value}
            alt='Preview'
            className='h-full w-full object-cover'
          />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2 h-6 w-6 rounded-full'
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className='size-3' />
          </Button>
        </div>
      )}
    </div>
  )
}
