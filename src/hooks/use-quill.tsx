import { useEffect, useRef, useState } from 'react'
import Quill, { type QuillOptions } from 'quill'

interface UseQuillOptions {
  theme?: QuillOptions['theme']
  modules?: QuillOptions['modules']
  placeholder?: string
  readOnly?: boolean
  onTextChange?: (delta: unknown, oldDelta: unknown, source: string) => void
}

interface UseQuillReturn {
  quill: Quill | null
  quillRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
}

/**
 * Custom hook for Quill editor that prevents duplicate toolbar initialization
 * @param options - Quill configuration options
 * @returns Object containing quill instance, ref, and ready state
 */
export function useQuill(options: UseQuillOptions): UseQuillReturn {
  const quillRef = useRef<HTMLDivElement | null>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Store initialization flag to prevent multiple inits
  const isInitialized = useRef(false)

  // Store callback ref to avoid stale closures
  const onTextChangeRef = useRef(options.onTextChange)

  // Update callback ref when it changes
  useEffect(() => {
    onTextChangeRef.current = options.onTextChange
  }, [options.onTextChange])

  // Initialize Quill editor only once
  useEffect(() => {
    if (!quillRef.current || isInitialized.current) {
      return
    }

    // Mark as initialized before creating instance
    isInitialized.current = true

    try {
      // Create Quill instance with provided options
      const instance = new Quill(quillRef.current, {
        theme: options.theme ?? 'snow',
        modules: options.modules,
        placeholder: options.placeholder ?? 'Start typing...',
        readOnly: options.readOnly ?? false,
      })

      // Setup text-change listener with ref to avoid stale closure
      const textChangeHandler = (delta: unknown, oldDelta: unknown, source: string) => {
        if (onTextChangeRef.current) {
          onTextChangeRef.current(delta, oldDelta, source)
        }
      }

      instance.on('text-change', textChangeHandler)

      setQuill(instance)
      setIsReady(true)

      // Cleanup function
      return () => {
        try {
          // Remove event listener
          instance.off('text-change', textChangeHandler)

          // Clear editor content
          if (instance.root) {
            instance.root.innerHTML = ''
          }

          // Remove toolbar if exists
          const toolbar =
            instance.root.parentElement?.querySelector('.ql-toolbar')
          if (toolbar) {
            toolbar.remove()
          }

          // Reset state
          setIsReady(false)
          setQuill(null)
          isInitialized.current = false
        } catch (error) {
          console.error('Error cleaning up Quill editor:', error)
        }
      }
    } catch (error) {
      console.error('Error initializing Quill editor:', error)
      isInitialized.current = false
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // ✅ Empty deps - initialize only once

  // Update readOnly state when it changes
  useEffect(() => {
    if (quill && typeof options.readOnly === 'boolean') {
      quill.enable(!options.readOnly)
    }
  }, [quill, options.readOnly])

  return { quill, quillRef, isReady }
}
