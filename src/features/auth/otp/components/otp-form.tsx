import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { verifyResetCode } from '@/api/services/auth.service'
import { cn } from '@/lib/utils'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement> & {
  email: string
  onResendCode: () => void
  isResending: boolean
}

export function OtpForm({
  email,
  onResendCode,
  isResending,
  className,
  ...props
}: Readonly<OtpFormProps>) {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/otp' })
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  // We explicitly track the value to disable the button
  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!search.email) {
      toast.error('Missing email. Please restart the process.')
      navigate({ to: '/forgot-password' })
      return
    }

    setIsLoading(true)
    try {
      await verifyResetCode({ email: search.email, code: data.otp })
      toast.success('Code verified successfully.')
      navigate({
        to: '/reset-password',
        search: { email: search.email, code: data.otp },
      })
    } catch (error: unknown) {
      console.error('OTP verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{' '}
          <span className='font-medium'>{email}</span>.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={className}
          {...props}
        >
          <CardContent>
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel htmlFor='otp-verification'>
                      Verification code
                    </FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm' // size="xs" wasn't defined in the standard Shadcn button, mapping closely using size="sm" with custom class
                      className='h-7 px-2 text-xs'
                      onClick={onResendCode}
                      disabled={isResending}
                    >
                      <RefreshCwIcon
                        className={cn(
                          'mr-1.5 h-3.5 w-3.5',
                          isResending && 'animate-spin'
                        )}
                      />
                      Resend Code
                    </Button>
                  </div>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      id='otp-verification'
                      required
                      {...field}
                    >
                      <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className='mx-2' />
                      <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    <a
                      href='/sign-in'
                      className='hover:text-primary transition-colors'
                    >
                      I no longer have access to this email address.
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className='w-full'>
              <Button
                type='submit'
                className='w-full'
                disabled={otp.length < 6 || isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
              <div className='text-muted-foreground mt-2 text-center text-sm'>
                Having trouble signing in?{' '}
                <a
                  href='mailto:support@medicalink.online'
                  className='hover:text-primary underline underline-offset-4 transition-colors'
                >
                  Contact support
                </a>
              </div>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
