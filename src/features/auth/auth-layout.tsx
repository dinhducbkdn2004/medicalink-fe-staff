import logoImage from '@/assets/images/rect-logo-xl.png'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <div className='relative min-h-svh w-full'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px),
            radial-gradient(125% 125% at 50% 10%, var(--auth-gradient-start) 40%, var(--auth-gradient-end) 100%)
          `,
          backgroundSize: `
            64px 64px,
            64px 64px,
            100% 100%
          `,
        }}
      />
      <div className='relative z-10 flex min-h-svh'>
        <img
          src={logoImage}
          alt='MedicaLink Logo'
          className='absolute top-6 left-6 h-12 w-auto md:top-8 md:left-11'
        />
        <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
          <div className='w-full max-w-sm'>{children}</div>
        </div>
      </div>
    </div>
  )
}
