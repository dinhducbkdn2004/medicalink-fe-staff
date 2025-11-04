/**
 * Image Upload Field Component
 * Handles image upload to Cloudinary with crop and preview
 *
 * Features:
 * - Image cropping with react-image-crop
 * - Drag & drop support
 * - Preview with hover actions
 * - Compact UI for better space usage
 */
import { useState, useRef, DragEvent } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { uploadImageToCloudinary } from '../utils/cloudinary'
import { ImageCropDialog } from './image-crop-dialog'

interface ImageUploadFieldProps {
  label: string
  description?: string
  value?: string
  onChange: (url: string) => void
  accessToken: string
  disabled?: boolean
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  compact?: boolean // Compact mode for smaller previews
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  accessToken,
  disabled = false,
  aspectRatio = 'square',
  compact = false,
}: Readonly<ImageUploadFieldProps>) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | undefined>(value)
  const [isDragging, setIsDragging] = useState(false)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert aspect ratio string to number for react-image-crop
  const aspectRatioNumber = {
    square: 1,
    portrait: 3 / 4,
    landscape: 4 / 3,
  }[aspectRatio]

  /**
   * Handle file selection - show crop dialog
   */
  const handleFileSelected = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước ảnh phải nhỏ hơn 10MB')
      return
    }

    // Read file and show crop dialog
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageToCrop(reader.result as string)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
  }

  /**
   * Handle cropped image - upload to Cloudinary
   */
  const handleCropComplete = async (croppedBlob: Blob) => {
    // Convert blob to File for upload
    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
      type: 'image/jpeg',
    })

    // Show preview immediately
    const previewUrl = URL.createObjectURL(croppedBlob)
    setPreview(previewUrl)

    // Upload to Cloudinary with progress
    setUploading(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const imageUrl = await uploadImageToCloudinary(croppedFile, accessToken)
      setProgress(100)
      onChange(imageUrl)
      toast.success('Upload successful')
      // Cleanup preview URL
      URL.revokeObjectURL(previewUrl)
      setPreview(imageUrl)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
      // Revert preview
      URL.revokeObjectURL(previewUrl)
      setPreview(value)
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
      setProgress(0)
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    await handleFileSelected(file)
  }

  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !uploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || uploading) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await handleFileSelected(files[0])
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const aspectRatioClasses = {
    square: 'aspect-square max-h-48',
    portrait: 'aspect-[3/4] max-h-64',
    landscape: 'aspect-[4/3] max-h-48',
  }

  return (
    <>
      {/* Image Crop Dialog */}
      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageToCrop}
          aspectRatio={aspectRatioNumber}
          onCropComplete={handleCropComplete}
          title={`Crop ${label}`}
          description='Adjust the crop area to fit your image perfectly'
        />
      )}

      <div className='space-y-3'>
        <div>
          <Label>{label}</Label>
          {description && (
            <p className='text-muted-foreground text-xs'>{description}</p>
          )}
        </div>

        <div className='space-y-4'>
          {/* Preview - Compact Design */}
          {preview ? (
            <div className='group relative'>
              <div
                className={cn(
                  'border-muted overflow-hidden rounded-lg border shadow-sm transition-all',
                  aspectRatioClasses[aspectRatio],
                  'w-full'
                )}
              >
                <img
                  src={preview}
                  alt='Preview'
                  className='h-full w-full object-cover'
                />
                {/* Hover Overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                {/* Action Buttons */}
                <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    onClick={handleClick}
                    disabled={disabled || uploading}
                  >
                    <Upload className='mr-1 h-3 w-3' />
                    Change
                  </Button>
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={handleRemove}
                    disabled={disabled || uploading}
                  >
                    <X className='mr-1 h-3 w-3' />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {uploading && (
                <div className='absolute right-0 bottom-0 left-0 h-1 overflow-hidden rounded-b-lg bg-gray-200'>
                  <div
                    className='bg-primary h-full transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Upload Button with Drag & Drop - Compact */
            <button
              type='button'
              onClick={handleClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              disabled={disabled || uploading}
              className={cn(
                'border-muted bg-muted/50 hover:bg-muted flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all',
                aspectRatioClasses[aspectRatio],
                disabled || uploading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
                isDragging && 'border-primary bg-primary/10 scale-[1.01]'
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className='text-primary h-8 w-8 animate-spin' />
                  <p className='text-muted-foreground mt-2 text-xs font-medium'>
                    Uploading... {progress}%
                  </p>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      'rounded-full p-3 transition-colors',
                      isDragging ? 'bg-primary/20' : 'bg-muted'
                    )}
                  >
                    <ImageIcon
                      className={cn(
                        'h-6 w-6 transition-colors',
                        isDragging ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <p className='text-muted-foreground mt-2 text-xs font-medium'>
                    {isDragging ? 'Drop here' : 'Click or drag image'}
                  </p>
                  <p className='text-muted-foreground mt-1 text-[10px]'>
                    Max 10MB
                  </p>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className='hidden'
          />
        </div>
      </div>
    </>
  )
}
