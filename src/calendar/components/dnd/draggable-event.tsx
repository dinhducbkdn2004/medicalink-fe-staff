'use client'

import { useRef, useEffect } from 'react'
import type { IEvent } from '@/calendar/interfaces'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { cn } from '@/lib/utils'
import { ItemTypes } from './constants'

interface DraggableEventProps {
  event: IEvent
  children: React.ReactNode
}

export function DraggableEvent({
  event,
  children,
}: Readonly<DraggableEventProps>) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: () => {
      const width = ref.current?.offsetWidth || 0
      const height = ref.current?.offsetHeight || 0
      return { event, children, width, height }
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))

  
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  drag(ref)

  return (
    <div ref={ref} className={cn(isDragging && 'opacity-40')}>
      {children}
    </div>
  )
}
