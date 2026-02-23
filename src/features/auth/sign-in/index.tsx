import { useSearch } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='dark:bg-background/60 gap-4 dark:backdrop-blur-md'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
          <div className='absolute top-4 right-4 flex items-center gap-2'>
            <Button asChild variant='outline' size='sm'>
              <a
                href='https://client.medicalink.click/'
                target='_blank'
                rel='noreferrer'
              >
                Client Portal
              </a>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' size='sm'>
                  <Info className='mr-2 h-4 w-4' />
                  Demo Credentials
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80' align='end'>
                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <h4 className='leading-none font-medium'>
                      Demo Credentials
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      Click to copy the credentials.
                    </p>
                  </div>
                  <div className='grid gap-2'>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <span className='text-sm font-medium'>SuperAdmin</span>
                      <div className='col-span-2 text-xs'>
                        <p className='select-all'>superadmin@medicalink.com</p>
                        <p className='select-all'>SuperAdmin123!</p>
                      </div>
                    </div>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <span className='text-sm font-medium'>Admin</span>
                      <div className='col-span-2 text-xs'>
                        <p className='select-all'>hanhnt@medicalink.com</p>
                        <p className='select-all'>Admin123!</p>
                      </div>
                    </div>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <span className='text-sm font-medium'>Doctor</span>
                      <div className='col-span-2 text-xs'>
                        <p className='select-all'>dinhducbkdn2004@gmail.com</p>
                        <p className='select-all'>Duc2004@</p>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
