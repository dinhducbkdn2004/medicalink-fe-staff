/**
 * Custom hook for managing Quill editor instance
 *
 * Triển khai theo hướng dẫn: docs/HUONG_DAN_SU_DUNG_QUILL.md
 *
 * Handles initialization, cleanup, and editor operations:
 * - Khởi tạo Quill instance với options
 * - Xử lý events (text-change, selection-change)
 * - Cleanup khi unmount
 * - TypeScript type safety
 */
import { useEffect, useRef, useState } from 'react'
import Quill, { type QuillOptions } from 'quill'

// ============================================================================
// Types
// ============================================================================

export interface UseQuillOptions extends Omit<QuillOptions, 'theme'> {
  theme?: 'snow' | 'bubble' | null
  onTextChange?: (delta: any, oldDelta: any, source: string) => void
  onSelectionChange?: (range: any, oldRange: any, source: string) => void
}

export interface UseQuillReturn {
  quill: Quill | null
  quillRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to initialize and manage a Quill editor instance
 *
 * Theo hướng dẫn: Khởi Tạo Editor với custom options
 *
 * @example
 * ```tsx
 * const { quill, quillRef, isReady } = useQuill({
 *   theme: 'snow',
 *   placeholder: 'Enter text...',
 *   modules: {
 *     toolbar: [['bold', 'italic'], ['link', 'image']],
 *     history: {
 *       delay: 1000,
 *       maxStack: 100,
 *       userOnly: true
 *     }
 *   },
 *   onTextChange: (delta, oldDelta, source) => {
 *     console.log('Content changed', delta);
 *   }
 * });
 * ```
 */
export function useQuill(options: UseQuillOptions = {}): UseQuillReturn {
  const {
    theme = 'snow',
    onTextChange,
    onSelectionChange,
    ...quillOptions
  } = options

  const quillRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Initialize Quill instance
  // Theo hướng dẫn: Khởi tạo Quill với container và options
  useEffect(() => {
    if (!quillRef.current) return

    // Clear any existing content to prevent duplicate toolbars
    const container = quillRef.current
    
    // Remove all existing child elements (toolbar and editor)
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Khởi tạo Quill instance
    const quillInstance = new Quill(container, {
      theme: theme ?? undefined,
      ...quillOptions,
    })

    setQuill(quillInstance)
    setIsReady(true)

    // Cleanup khi component unmount
    return () => {
      // Properly cleanup Quill instance
      if (quillInstance) {
        // Remove all event listeners
        quillInstance.off('text-change')
        quillInstance.off('selection-change')
      }
      
      // Clear the container on cleanup
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
      setQuill(null)
      setIsReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Text change handler
  // Theo hướng dẫn: Lắng nghe sự kiện text-change
  useEffect(() => {
    if (!quill || !onTextChange) return

    const handler = (delta: any, oldDelta: any, source: string) => {
      onTextChange(delta, oldDelta, source)
    }

    // Đăng ký event listener
    quill.on('text-change', handler)

    // Cleanup: Hủy đăng ký khi unmount
    return () => {
      quill.off('text-change', handler)
    }
  }, [quill, onTextChange])

  // Selection change handler
  // Theo hướng dẫn: Lắng nghe sự kiện selection-change
  useEffect(() => {
    if (!quill || !onSelectionChange) return

    const handler = (range: any, oldRange: any, source: string) => {
      onSelectionChange(range, oldRange, source)
    }

    // Đăng ký event listener
    quill.on('selection-change', handler)

    // Cleanup: Hủy đăng ký khi unmount
    return () => {
      quill.off('selection-change', handler)
    }
  }, [quill, onSelectionChange])

  return { quill, quillRef, isReady }
}
