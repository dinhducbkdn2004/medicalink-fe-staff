import { Shield, UserCheck } from 'lucide-react'

export const staffRoles = [
  {
    label: 'Super Admin',
    value: 'SUPER_ADMIN',
    icon: Shield,
    description: 'Full system access, can manage all resources',
  },
  {
    label: 'Admin',
    value: 'ADMIN',
    icon: UserCheck,
    description: 'Can manage most resources except super admins',
  },
] as const

export const genderOptions = [
  { label: 'Male', value: 'true' },
  { label: 'Female', value: 'false' },
] as const

export const sortByOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Full Name', value: 'fullName' },
  { label: 'Email', value: 'email' },
] as const

export const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
] as const
