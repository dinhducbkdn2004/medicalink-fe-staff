/**
 * Image Crop Dialog Component
 * Uses react-image-crop for cropping images before upload
 *
 * Features:
 * - Aspect ratio presets (square, portrait, landscape)
 * - Preview cropped image
 * - Responsive design
 * - TypeScript support
 */
import { useState, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// ============================================================================
// Types
// ============================================================================

export interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  aspectRatio?: number // e.g., 1 for square, 4/3 for landscape, 3/4 for portrait
  onCropComplete: (croppedImageBlob: Blob) => void | Promise<void>
  title?: string
  description?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate cropped image blob from canvas
 */
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return Promise.reject(new Error('No 2d context'))
  }

  // Set canvas size to crop size
  canvas.width = crop.width
  canvas.height = crop.height

  // Draw the cropped image
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      0.95
    )
  })
}

// ============================================================================
// Component
// ============================================================================

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspectRatio = 1, // Default to square
  onCropComplete,
  title = 'Crop Image',
  description = 'Adjust the crop area to fit your image',
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [processing, setProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  /**
   * Initialize crop when image loads
   * Theo hướng dẫn: centerCrop và makeAspectCrop
   */
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget

      // Create centered crop with aspect ratio
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      )

      setCrop(newCrop)
    },
    [aspectRatio]
  )

  /**
   * Handle crop completion and generate blob
   */
  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return
    }

    setProcessing(true)
    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop)
      await onCropComplete(croppedBlob)
      onOpenChange(false)
    } catch (error) {
      console.error('Crop failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='max-h-[60vh] overflow-auto'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className='max-w-full'
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt='Crop preview'
              onLoad={onImageLoad}
              className='max-h-[50vh] w-auto'
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleCropComplete}
            disabled={!completedCrop || processing}
          >
            {processing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Apply Crop'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
