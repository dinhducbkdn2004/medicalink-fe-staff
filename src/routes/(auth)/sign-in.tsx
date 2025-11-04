import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
  beforeLoad: () => {
    // Check if user is already authenticated
    const accessToken = localStorage.getItem('access_token')

    // If authenticated, redirect to home
    if (accessToken) {
      throw redirect({ to: '/' })
    }
  },
})
