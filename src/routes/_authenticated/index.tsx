import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Dashboard } from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardRoute,
})

function DashboardRoute() {
  const { user } = useAuthStore()

  if (user?.role === 'DOCTOR') {
    return <Navigate to='/appointments' />
  }

  return <Dashboard />
}
