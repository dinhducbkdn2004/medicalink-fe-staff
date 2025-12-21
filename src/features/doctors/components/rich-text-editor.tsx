/**
 * Enhanced Rich Text Editor Component using Quill 2.0.3
 *
 * Triển khai theo hướng dẫn: docs/HUONG_DAN_SU_DUNG_QUILL.md
 *
 * Đầy đủ tính năng:
 * ✅ Upload ảnh lên Cloudinary (với custom handler)
 * ✅ Upload video lên Cloudinary (với custom handler)
 * ✅ Đầy đủ các công cụ định dạng văn bản (bold, italic, underline, etc.)
 * ✅ Syntax Highlighting với highlight.js (code blocks)
 * ✅ Math Formula với KaTeX
 * ✅ Drag & Drop support để upload ảnh
 * ✅ Paste image from clipboard
 * ✅ Progress tracking khi upload
 * ✅ TypeScript support đầy đủ
 * ✅ Multiple toolbar options (full, basic, minimal)
 * ✅ History module (Undo/Redo)
 * ✅ Clipboard module
 * ✅ Events handling (text-change, selection-change)
 * ✅ Read-only mode support
 *
 * API Methods được hỗ trợ:
 * - getSemanticHTML(): Lấy nội dung HTML
 * - insertEmbed(): Chèn image/video
 * - getSelection(): Lấy vùng được chọn
 * - setSelection(): Set cursor position
 * - enable/disable(): Bật/tắt editor
 */
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ImageIcon, Loader2, Video } from 'lucide-react'
import type Quill from 'quill'
// Note: Quill loaded from CDN in index.html
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useQuill } from '@/hooks/use-quill'
import {
  useMediaUpload,
  validateImageFile,
  validateVideoFile,
} from '../utils/cloudinary'

// ============================================================================
// Types
// ============================================================================

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
  enableSyntax?: boolean // Enable syntax highlighting
  enableFormula?: boolean // Enable math formulas
  size?: 'compact' | 'medium' | 'large' // Editor size
}

// ============================================================================
// Toolbar Configurations
// Theo hướng dẫn: Toolbar Đầy Đủ với tất cả các tính năng
// Bao gồm: syntax highlighting và formula
// ============================================================================

const TOOLBAR_CONFIGS = {
  // Full toolbar với đầy đủ tính năng (bao gồm code-block)
  full: [
    // Headers (h1-h6)
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    // Font family & size
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],

    // Text formatting
    ['bold', 'italic', 'underline', 'strike'],

    // Text color and background
    [{ color: [] }, { background: [] }],

    // Superscript/subscript
    [{ script: 'sub' }, { script: 'super' }],

    // Lists
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

    // Indent
    [{ indent: '-1' }, { indent: '+1' }],

    // Alignment
    [{ align: [] }],

    // Direction (RTL)
    [{ direction: 'rtl' }],

    // Blockquote and code block (syntax highlighting)
    ['blockquote', 'code-block'],

    // Links, images, videos
    ['link', 'image', 'video'],

    // Clean formatting
    ['clean'],
  ],

  // Basic toolbar cho sử dụng thông thường
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

  // Minimal toolbar cho nhu cầu đơn giản
  minimal: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

// ============================================================================
// Component
// ============================================================================

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
  const isControlled = value !== undefined

  /**
   * Custom image handler for Cloudinary upload
   * Theo hướng dẫn: Chèn hình ảnh với custom handler
   */
  const imageHandler = useCallback(() => {
    if (!enableImageUpload) {
      toast.warning('Upload images is disabled')
      return
    }

    // Tạo input file ẩn
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/jpeg,image/png,image/webp,image/gif')
    input.setAttribute('multiple', 'false')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      // Get Quill instance first
      const quill = quillInstanceRef.current
      if (!quill) {
        toast.error('Editor is not ready')
        return
      }

      // Get current cursor position before upload
      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        // Disable editor during upload
        quill.enable(false)

        // Show loading toast
        toast.loading('Uploading image...', { id: 'image-upload' })

        // Upload lên Cloudinary
        const result = await uploadMedia(file, accessToken)

        // Insert actual image at cursor position
        quill.insertEmbed(cursorPosition, 'image', result.secure_url)

        // Move cursor after image
        quill.setSelection(cursorPosition + 1)

        // Trigger onChange with HTML content
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
        // Re-enable editor
        quill.enable(true)
      }
    }
  }, [uploadMedia, accessToken, onChange, enableImageUpload])

  /**
   * Custom video handler for Cloudinary upload
   * Theo hướng dẫn: Chèn video với custom handler
   */
  const videoHandler = useCallback(() => {
    if (!enableVideoUpload) {
      toast.warning('Upload video is disabled')
      return
    }

    // Tạo input file ẩn
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'video/mp4,video/webm,video/quicktime')
    input.setAttribute('multiple', 'false')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // Validate file
      const validation = validateVideoFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      // Get Quill instance first
      const quill = quillInstanceRef.current
      if (!quill) {
        toast.error('Editor is not ready')
        return
      }

      // Get current cursor position before upload
      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        // Disable editor during upload
        quill.enable(false)

        // Show loading toast
        toast.loading('Uploading video... This may take a few minutes.', {
          id: 'video-upload',
        })

        // Upload lên Cloudinary
        const result = await uploadMedia(file, accessToken)

        // Insert actual video at cursor position
        quill.insertEmbed(cursorPosition, 'video', result.secure_url)

        // Move cursor after video
        quill.setSelection(cursorPosition + 1)

        // Trigger onChange with HTML content
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
        // Re-enable editor
        quill.enable(true)
      }
    }
  }, [uploadMedia, accessToken, onChange, enableVideoUpload])

  /**
   * Toolbar configuration
   * Theo hướng dẫn: Tùy chỉnh toolbar theo nhu cầu
   */
  const toolbarContainer = useMemo(() => {
    if (Array.isArray(toolbarOptions)) {
      return toolbarOptions
    }

    let config = TOOLBAR_CONFIGS[toolbarOptions]

    // Filter out image/video if disabled
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

  /**
   * Quill modules configuration
   * Theo hướng dẫn: Cấu hình các module của Quill
   * - Toolbar: Custom handlers cho image/video
   * - Clipboard: Xử lý copy/paste
   * - History: Undo/Redo với delay 1s, max 100 actions
   * - Syntax: Code syntax highlighting với highlight.js
   */
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
        delay: 1000, // Thời gian delay giữa các thao tác (ms)
        maxStack: 100, // Số lượng thao tác tối đa được lưu
        userOnly: true, // Chỉ lưu thao tác của user
      },
    }),
    [toolbarContainer, imageHandler, videoHandler]
  )

  /**
   * Text change handler
   * Theo hướng dẫn: Sử dụng event text-change để theo dõi thay đổi
   */
  const handleTextChange = useCallback(
    (_delta: unknown, _oldDelta: unknown, source: string) => {
      const quill = quillInstanceRef.current
      if (!quill) return

      // Chỉ trigger onChange cho thay đổi từ user
      if (source === 'user' && onChange) {
        // Lấy HTML bằng getSemanticHTML() (recommended method)
        let html = quill.getSemanticHTML()

        // Replace &nbsp; with regular space to prevent UI issues
        if (html) {
          html = html.replace(/&nbsp;/g, ' ')
        }

        lastValueRef.current = html
        onChange(html)
      }
    },
    [onChange]
  )

  /**
   * Initialize Quill
   */
  const { quill, quillRef, isReady } = useQuill({
    theme: 'snow',
    modules,
    placeholder,
    readOnly: disabled || uploading,
    enableSyntax,
    enableFormula,
    onTextChange: handleTextChange,
  })

  // Keep quill instance ref updated
  useEffect(() => {
    quillInstanceRef.current = quill
  }, [quill])

  /**
   * Helper to set content
   * Theo hướng dẫn: Hỗ trợ cả Delta format và HTML
   */
  const setContent = useCallback((content: string) => {
    const quill = quillInstanceRef.current
    if (!quill || !content) return

    try {
      // Kiểm tra nếu content là Delta JSON
      if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
        const delta = JSON.parse(content) as Record<string, unknown>
        // Sử dụng setContents cho Delta format
        quill.setContents(delta, 'silent')
        const html = quill.getSemanticHTML()
        lastValueRef.current = html
      } else {
        // Content là HTML
        const currentContent = quill.getSemanticHTML()
        if (currentContent !== content) {
          // Set HTML content
          quill.root.innerHTML = content
          lastValueRef.current = content
        }
      }
    } catch (_error) {
      // Content is not Delta format, treating as HTML
      const currentContent = quill.getSemanticHTML()
      if (currentContent !== content) {
        quill.root.innerHTML = content
        lastValueRef.current = content
      }
    }
  }, [])

  /**
   * Set initial content
   */
  useEffect(() => {
    if (!quill || !isReady) return

    const initialValue = value || defaultValue
    if (initialValue) {
      setContent(initialValue)
    }
  }, [quill, isReady, defaultValue, value, setContent])

  /**
   * Update content when value prop changes (controlled mode)
   */
  useEffect(() => {
    if (!quill || !isControlled || !isReady || !value) return

    const currentContent = quill.getSemanticHTML()
    // Only update if value is different from current content
    // Skip if the value matches what's already in the editor to prevent cursor jump
    if (value !== currentContent) {
      // Additional check: if value matches the last value we emitted via onChange,
      // it means this update came from user input, so skip
      if (value === lastValueRef.current) {
        return
      }
      setContent(value)
      lastValueRef.current = value
    }
  }, [quill, value, isControlled, isReady, setContent])

  /**
   * Enable/disable editor
   */
  useEffect(() => {
    if (!quill) return

    if (disabled || uploading) {
      quill.disable()
    } else {
      quill.enable()
    }
  }, [quill, disabled, uploading])

  /**
   * Handle paste image from clipboard
   * Theo hướng dẫn: Paste Image From Clipboard
   */
  useEffect(() => {
    if (!quill || !enableImageUpload) return

    const uploadImageFromBlob = async (blob: File) => {
      // Get cursor position before upload
      const range = quill.getSelection(true)
      if (!range) {
        toast.error('Please click in the editor first')
        return
      }

      const cursorPosition = range.index

      try {
        // Disable editor during upload
        quill.enable(false)

        // Show loading toast
        toast.loading('Uploading image from clipboard...', {
          id: 'clipboard-upload',
        })

        const result = await uploadMedia(blob, accessToken)

        // Insert actual image
        quill.insertEmbed(cursorPosition, 'image', result.secure_url)

        // Move cursor after image
        quill.setSelection(cursorPosition + 1)

        // Trigger onChange
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
        // Re-enable editor
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

  /**
   * Handle drag and drop file upload
   * Theo hướng dẫn: Drag and Drop Upload
   */
  useEffect(() => {
    if (!quill || !enableImageUpload) return

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      // Lấy vị trí drop
      const range = quill.getSelection(true)
      let index = range ? range.index : quill.getLength()

      // Xử lý từng file
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          // Validate
          const validation = validateImageFile(file)
          if (!validation.valid) {
            toast.error(validation.error || 'File is not valid')
            continue
          }

          try {
            toast.info('Uploading image...')
            const result = await uploadMedia(file, accessToken)

            // Chèn hình ảnh
            quill.insertEmbed(index, 'image', result.secure_url)
            index++

            toast.success('Uploading image successful!')
          } catch (error) {
            console.error('Drop image upload failed:', error)
            toast.error('Uploading image failed')
          }
        }
      }

      // Trigger onChange
      if (onChange) {
        const html = quill.getSemanticHTML()
        lastValueRef.current = html
        onChange(html)
      }

      // Set cursor tại vị trí cuối
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
      {/* Editor container */}
      <div
        ref={quillRef}
        className={cn(
          'rich-text-editor',
          size && `ql-editor-${size}`,
          disabled && 'opacity-50'
        )}
      />

      {/* Upload loading overlay */}
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

// ============================================================================
// Display Component (Read-only)
// ============================================================================

export interface RichTextDisplayProps {
  content: string
  className?: string
}

/**
 * Display rich text content in read-only mode
 */
export function RichTextDisplay({
  content,
  className = '',
}: Readonly<RichTextDisplayProps>) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        // Video styling
        'prose-video:aspect-video prose-video:w-full prose-video:max-w-2xl',
        'prose-video:rounded-lg prose-video:border prose-video:border-border',
        // Image styling
        'prose-img:rounded-lg prose-img:shadow-sm',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
