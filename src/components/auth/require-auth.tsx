

import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { hasAnyRole } from '@/lib/auth-utils'
import type { UserRole } from '@/api/types/auth.types'
import { Loader2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface RequireAuthProps {
  children: React.ReactNode
  roles?: UserRole[]
  redirectTo?: string
}


export function RequireAuth({
  children,
  roles,
  redirectTo = '/sign-in',
}: RequireAuthProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()

  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search
      navigate({
        to: redirectTo,
        search: { redirect: currentPath },
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  
  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-muted-foreground text-sm'>Loading...</p>
        </div>
      </div>
    )
  }

  
  if (!isAuthenticated) {
    return null
  }

  
  if (roles && roles.length > 0 && !hasAnyRole(user, roles)) {
    return (
      <div className='flex h-screen w-full items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <ShieldAlert className='h-6 w-6 text-destructive' />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              This page requires one of the following roles:{' '}
              <span className='font-medium'>{roles.join(', ')}</span>
            </p>
            <p className='text-muted-foreground mt-2 text-sm'>
              Your current role: <span className='font-medium'>{user?.role}</span>
            </p>
          </CardContent>
          <CardFooter className='flex gap-2'>
            <Button variant='outline' onClick={() => navigate({ to: '/' })}>
              Go to Dashboard
            </Button>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  
  return <>{children}</>
}

