import { useEffect, useRef } from 'react'
import Quill from 'quill'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'Write something amazing...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      })

      quillRef.current.on('text-change', () => {
        let content = quillRef.current?.root.innerHTML
        if (content && content !== value) {
          // Replace &nbsp; with regular space to prevent UI issues
          content = content.replace(/&nbsp;/g, ' ')
          onChange(content)
        }
      })
    }

    return () => {
      // Cleanup if needed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync value from prop to editor (only if different to prevent cursor jumps)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-md border [&_.ql-container]:!border-0 [&_.ql-toolbar]:!border-0',
        className
      )}
    >
      <div ref={editorRef} className='bg-background min-h-[200px]' />
    </div>
  )
}
