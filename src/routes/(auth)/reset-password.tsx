import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPassword } from '@/features/auth/reset-password'

const resetPasswordSearchSchema = z.object({
  email: z.string().email().optional(),
  code: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: ResetPassword,
})
