import { useEffect, useRef, useState } from 'react'
import Quill, { type QuillOptions } from 'quill'

// Declare global variables from CDN
declare global {
  interface Window {
    hljs?: {
      highlightBlock: (block: HTMLElement) => void
      highlightAuto: (text: string) => { value: string; language: string }
      configure: (options: { languages: string[] }) => void
    }
    katex?: {
      render: (
        math: string,
        element: HTMLElement,
        options?: { throwOnError: boolean; displayMode?: boolean }
      ) => void
    }
  }
}

interface UseQuillOptions {
  theme?: QuillOptions['theme']
  modules?: QuillOptions['modules']
  placeholder?: string
  readOnly?: boolean
  enableSyntax?: boolean
  enableFormula?: boolean
  onTextChange?: (delta: unknown, oldDelta: unknown, source: string) => void
}

interface UseQuillReturn {
  quill: Quill | null
  quillRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
}

/**
 * Custom hook for Quill editor with syntax highlighting and formula support
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
    if (!quillRef.current || isInitialized.current) return

    isInitialized.current = true

    let instance: Quill | null = null
    // Capture ref value for cleanup
    const currentQuillRef = quillRef.current

    try {
      const moduleConfig = { ...options.modules }

      // Syntax highlighting
      if (options.enableSyntax && globalThis.window?.hljs) {
        globalThis.window.hljs.configure({
          languages: [
            'javascript',
            'typescript',
            'python',
            'java',
            'cpp',
            'csharp',
            'php',
            'ruby',
            'go',
            'rust',
            'sql',
            'html',
            'css',
            'json',
            'xml',
            'yaml',
            'markdown',
            'bash',
            'shell',
          ],
        })

        moduleConfig.syntax = {
          highlight: (text: string) => {
            try {
              return globalThis.window?.hljs
                ? globalThis.window.hljs.highlightAuto(text).value
                : text
            } catch {
              return text
            }
          },
        }
      }

      // 💡 Dọn sạch mọi toolbar hoặc nội dung cũ trước khi init
      const container = currentQuillRef.parentElement
      if (container) {
        container.querySelectorAll('.ql-toolbar').forEach((tb) => tb.remove())
        currentQuillRef.innerHTML = ''
      }

      // Init Quill
      instance = new Quill(currentQuillRef, {
        theme: options.theme ?? 'snow',
        modules: moduleConfig,
        placeholder: options.placeholder ?? 'Start typing...',
        readOnly: options.readOnly ?? false,
      })

      // Event listener
      const textChangeHandler = (
        delta: unknown,
        oldDelta: unknown,
        source: string
      ) => {
        onTextChangeRef.current?.(delta, oldDelta, source)
      }
      instance.on('text-change', textChangeHandler)

      setQuill(instance)
      setIsReady(true)

      // ✅ Cleanup
      return () => {
        instance?.off('text-change', textChangeHandler)
        // Remove all toolbars linked to this container
        const container = currentQuillRef?.parentElement
        if (container) {
          container.querySelectorAll('.ql-toolbar').forEach((tb) => tb.remove())
        }
        if (currentQuillRef) {
          currentQuillRef.innerHTML = ''
        }
        setQuill(null)
        setIsReady(false)
        isInitialized.current = false
      }
    } catch (error) {
      console.error('Error initializing Quill editor:', error)
      isInitialized.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update readOnly state when it changes
  useEffect(() => {
    if (quill && typeof options.readOnly === 'boolean') {
      quill.enable(!options.readOnly)
    }
  }, [quill, options.readOnly])

  return { quill, quillRef, isReady }
}
