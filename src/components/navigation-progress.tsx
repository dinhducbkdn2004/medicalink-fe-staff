import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'

/**
 * NavigationProgress Component
 * Top loading bar that shows during route transitions
 * Provides visual feedback when navigating between pages
 */
export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null)
  const state = useRouterState()

  useEffect(() => {
    if (state.status === 'pending') {
      ref.current?.continuousStart()
    } else {
      ref.current?.complete()
    }
  }, [state.status])

  return (
    <LoadingBar
      color='hsl(var(--primary))'
      ref={ref}
      shadow={true}
      height={3}
      waitingTime={400}
    />
  )
}
