import { useEffect, useRef, useState } from 'react'
import Quill, { type QuillOptions } from 'quill'

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

export function useQuill(options: UseQuillOptions): UseQuillReturn {
  const quillRef = useRef<HTMLDivElement | null>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const [isReady, setIsReady] = useState(false)

  const isInitialized = useRef(false)

  const onTextChangeRef = useRef(options.onTextChange)

  useEffect(() => {
    onTextChangeRef.current = options.onTextChange
  }, [options.onTextChange])

  useEffect(() => {
    if (!quillRef.current || isInitialized.current) return

    isInitialized.current = true

    let instance: Quill | null = null

    const currentQuillRef = quillRef.current

    try {
      const moduleConfig = { ...options.modules }

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

      const container = currentQuillRef.parentElement
      if (container) {
        container.querySelectorAll('.ql-toolbar').forEach((tb) => tb.remove())
        currentQuillRef.innerHTML = ''
      }

      instance = new Quill(currentQuillRef, {
        theme: options.theme ?? 'snow',
        modules: moduleConfig,
        placeholder: options.placeholder ?? 'Start typing...',
        readOnly: options.readOnly ?? false,
      })

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

      return () => {
        instance?.off('text-change', textChangeHandler)

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

  useEffect(() => {
    if (quill && typeof options.readOnly === 'boolean') {
      quill.enable(!options.readOnly)
    }
  }, [quill, options.readOnly])

  return { quill, quillRef, isReady }
}
