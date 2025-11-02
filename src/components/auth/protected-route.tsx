/**
 * Protected Route Component
 * Wrapper component that ensures user is authenticated before rendering children
 */
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  redirectTo = '/sign-in',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current location for redirect after login
      const currentPath = window.location.pathname + window.location.search

      navigate({
        to: redirectTo,
        search: { redirect: currentPath },
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, return null (navigation will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
