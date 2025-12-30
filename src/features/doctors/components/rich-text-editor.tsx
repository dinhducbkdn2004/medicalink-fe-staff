import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ImageIcon, Loader2, Video } from 'lucide-react'
import type Quill from 'quill'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useQuill } from '@/hooks/use-quill'
import {
  useMediaUpload,
  validateImageFile,
  validateVideoFile,
} from '../utils/cloudinary'

export interface RichTextEditorProps {
  value?: string
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
  accessToken: string
  className?: string
  disabled?: boolean
  toolbarOptions?: 'full' | 'basic' | 'minimal' | unknown[]
  enableImageUpload?: boolean
  enableVideoUpload?: boolean
  enableSyntax?: boolean
  enableFormula?: boolean
  size?: 'compact' | 'medium' | 'large'
}

const TOOLBAR_CONFIGS = {
  full: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],

    ['bold', 'italic', 'underline', 'strike'],

    [{ color: [] }, { background: [] }],

    [{ script: 'sub' }, { script: 'super' }],

    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

    [{ indent: '-1' }, { indent: '+1' }],

    [{ align: [] }],

    [{ direction: 'rtl' }],

    ['blockquote', 'code-block'],

    ['link', 'image', 'video'],

    ['clean'],
  ],

  basic: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote'],
    [{ color: [] }, { background: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],

  minimal: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

export function RichTextEditor({
  value,
  defaultValue,
  onChange,
  placeholder = 'Enter your content here...',
  accessToken,
  className = '',
  disabled = false,
  toolbarOptions = 'basic',
  enableImageUpload = true,
  enableVideoUpload = true,
  enableSyntax = true,
  enableFormula = true,
  size = 'medium',
}: Readonly<RichTextEditorProps>) {
  const { uploadMedia, uploading, progress, uploadType } = useMediaUpload()
  const quillInstanceRef = useRef<Quill | null>(null)
  const lastValueRef = useRef<string | undefined>(value || defaultValue)

  const imageHandler = useCallback(() => {
    if (!enableImageUpload) {
      toast.warning('Upload images is disabled')
      return
    }

    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/jpeg,image/png,image/webp,image/gif')
    input.setAttribute('multiple', 'false')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      const quill = quillInstanceRef.current
      if (!quill) {
        toast.error('Editor is not ready')
        return
      }

      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        quill.enable(false)

        toast.loading('Uploading image...', { id: 'image-upload' })

        const result = await uploadMedia(file, accessToken)

        quill.insertEmbed(cursorPosition, 'image', result.secure_url)

        quill.setSelection(cursorPosition + 1)

        if (onChange) {
          const html = quill.getSemanticHTML()
          lastValueRef.current = html
          onChange(html)
        }

        toast.success('Image uploaded successfully', { id: 'image-upload' })
      } catch (error) {
        console.error('Image upload failed:', error)
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload image',
          { id: 'image-upload' }
        )
      } finally {
        quill.enable(true)
      }
    }
  }, [uploadMedia, accessToken, onChange, enableImageUpload])

  const videoHandler = useCallback(() => {
    if (!enableVideoUpload) {
      toast.warning('Upload video is disabled')
      return
    }

    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'video/mp4,video/webm,video/quicktime')
    input.setAttribute('multiple', 'false')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const validation = validateVideoFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      const quill = quillInstanceRef.current
      if (!quill) {
        toast.error('Editor is not ready')
        return
      }

      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        quill.enable(false)

        toast.loading('Uploading video... This may take a few minutes.', {
          id: 'video-upload',
        })

        const result = await uploadMedia(file, accessToken)

        quill.insertEmbed(cursorPosition, 'video', result.secure_url)

        quill.setSelection(cursorPosition + 1)

        if (onChange) {
          const html = quill.getSemanticHTML()
          lastValueRef.current = html
          onChange(html)
        }

        toast.success('Video uploaded successfully', { id: 'video-upload' })
      } catch (error) {
        console.error('Video upload failed:', error)
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload video',
          { id: 'video-upload' }
        )
      } finally {
        quill.enable(true)
      }
    }
  }, [uploadMedia, accessToken, onChange, enableVideoUpload])

  const toolbarContainer = useMemo(() => {
    if (Array.isArray(toolbarOptions)) {
      return toolbarOptions
    }

    let config = TOOLBAR_CONFIGS[toolbarOptions]

    if (!enableImageUpload || !enableVideoUpload) {
      config = config.map((row: unknown) => {
        if (Array.isArray(row)) {
          return row.filter((item: unknown) => {
            if (item === 'image' && !enableImageUpload) return false
            if (item === 'video' && !enableVideoUpload) return false
            return true
          })
        }
        return row
      }) as typeof config
    }

    return config
  }, [toolbarOptions, enableImageUpload, enableVideoUpload])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarContainer,
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true,
      },
    }),
    [toolbarContainer, imageHandler, videoHandler]
  )

  const handleTextChange = useCallback(
    (_delta: unknown, _oldDelta: unknown, source: string) => {
      const quill = quillInstanceRef.current
      if (!quill) return

      if (source === 'user' && onChange) {
        let html = quill.getSemanticHTML()

        if (html) {
          html = html.replace(/&nbsp;/g, ' ')
        }

        lastValueRef.current = html
        onChange(html)
      }
    },
    [onChange]
  )

  const { quill, quillRef, isReady } = useQuill({
    theme: 'snow',
    modules,
    placeholder,
    readOnly: disabled || uploading,
    enableSyntax,
    enableFormula,
    onTextChange: handleTextChange,
  })

  useEffect(() => {
    quillInstanceRef.current = quill
  }, [quill])

  const setContent = useCallback((content: string) => {
    const quill = quillInstanceRef.current
    if (!quill || !content) return

    try {
      if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
        const delta = JSON.parse(content) as Record<string, unknown>
        quill.setContents(delta, 'silent')
      } else {
        const delta = quill.clipboard.convert({ html: content })
        quill.setContents(delta, 'silent')
      }
      lastValueRef.current = quill.getSemanticHTML()
    } catch (error) {
      console.error('Failed to set content:', error)

      quill.root.innerHTML = content
      lastValueRef.current = content
    }
  }, [])

  useEffect(() => {
    if (!quill || !isReady) return

    const initialValue = value ?? defaultValue
    if (initialValue) {
      setContent(initialValue)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, isReady])

  useEffect(() => {
    if (!quill) return

    if (disabled || uploading) {
      quill.disable()
    } else {
      quill.enable()
    }
  }, [quill, disabled, uploading])

  useEffect(() => {
    if (!quill || !enableImageUpload) return

    const uploadImageFromBlob = async (blob: File) => {
      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        quill.enable(false)

        toast.loading('Uploading image from clipboard...', {
          id: 'clipboard-upload',
        })

        const result = await uploadMedia(blob, accessToken)

        quill.insertEmbed(cursorPosition, 'image', result.secure_url)

        quill.setSelection(cursorPosition + 1)

        if (onChange) {
          const html = quill.getSemanticHTML()
          lastValueRef.current = html
          onChange(html)
        }

        toast.success('Image uploaded successfully', { id: 'clipboard-upload' })
      } catch (error) {
        console.error('Clipboard image upload failed:', error)
        toast.error('Failed to upload image from clipboard', {
          id: 'clipboard-upload',
        })
      } finally {
        quill.enable(true)
      }
    }

    const handlePaste = async (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData
      if (!clipboardData) return

      const items = Array.from(clipboardData.items)
      for (const item of items) {
        if (item.type.includes('image')) {
          e.preventDefault()
          const blob = item.getAsFile()
          if (blob) {
            await uploadImageFromBlob(blob)
          }
        }
      }
    }

    quill.root.addEventListener('paste', handlePaste)
    return () => {
      quill.root.removeEventListener('paste', handlePaste)
    }
  }, [quill, uploadMedia, accessToken, onChange, enableImageUpload])

  useEffect(() => {
    if (!quill || !enableImageUpload) return

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      const range = quill.getSelection(true)
      let index = range ? range.index : quill.getLength()

      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const validation = validateImageFile(file)
          if (!validation.valid) {
            toast.error(validation.error || 'File is not valid')
            continue
          }

          try {
            toast.info('Uploading image...')
            const result = await uploadMedia(file, accessToken)

            quill.insertEmbed(index, 'image', result.secure_url)
            index++

            toast.success('Uploading image successful!')
          } catch (error) {
            console.error('Drop image upload failed:', error)
            toast.error('Uploading image failed')
          }
        }
      }

      if (onChange) {
        const html = quill.getSemanticHTML()
        lastValueRef.current = html
        onChange(html)
      }

      quill.setSelection(index)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    quill.root.addEventListener('drop', handleDrop as unknown as EventListener)
    quill.root.addEventListener(
      'dragover',
      handleDragOver as unknown as EventListener
    )

    return () => {
      quill.root.removeEventListener(
        'drop',
        handleDrop as unknown as EventListener
      )
      quill.root.removeEventListener(
        'dragover',
        handleDragOver as unknown as EventListener
      )
    }
  }, [quill, uploadMedia, accessToken, onChange, enableImageUpload])

  return (
    <div className={cn('rich-text-editor-wrapper relative', className)}>
      {}
      <div
        ref={quillRef}
        className={cn(
          'rich-text-editor',
          size && `ql-editor-${size}`,
          disabled && 'opacity-50'
        )}
      />

      {}
      {uploading && (
        <div className='absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/90 backdrop-blur-sm dark:bg-gray-900/90'>
          <div className='flex flex-col items-center gap-3'>
            {uploadType === 'image' ? (
              <ImageIcon className='text-primary h-12 w-12 animate-pulse' />
            ) : (
              <Video className='text-primary h-12 w-12 animate-pulse' />
            )}
            <div className='flex items-center gap-2'>
              <Loader2 className='text-primary h-5 w-5 animate-spin' />
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {uploadType === 'image'
                  ? 'Uploading image...'
                  : 'Uploading video...'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='bg-muted h-2 w-48 overflow-hidden rounded-full'>
                <div
                  className='bg-primary h-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className='text-muted-foreground text-xs font-medium'>
                {progress}%
              </span>
            </div>
            {uploadType === 'video' && (
              <p className='text-muted-foreground text-xs'>
                Video is being processed, please wait...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export interface RichTextDisplayProps {
  content: string
  className?: string
}

export function RichTextDisplay({
  content,
  className = '',
}: Readonly<RichTextDisplayProps>) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',

        'prose-video:aspect-video prose-video:w-full prose-video:max-w-2xl',
        'prose-video:rounded-lg prose-video:border prose-video:border-border',

        'prose-img:rounded-lg prose-img:shadow-sm',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
