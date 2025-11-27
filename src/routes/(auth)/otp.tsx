import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Otp } from '@/features/auth/otp'

const otpSearchSchema = z.object({
  email: z.string().email().optional(),
})

export const Route = createFileRoute('/(auth)/otp')({
  validateSearch: (search) => otpSearchSchema.parse(search),
  component: Otp,
})
