import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardRoute,
})

function DashboardRoute() {
  // Dashboard component now handles role-based rendering internally
  // - Doctor: Shows DoctorDashboard with personal stats
  // - Admin/SuperAdmin: Shows system-wide dashboard
  return <Dashboard />
}
