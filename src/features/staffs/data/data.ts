import { Shield, UserCheck } from 'lucide-react'

/**
 * Staff roles configuration
 * Matches the Staffs API role values and provides UI metadata
 */
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

/**
 * Gender options for staff
 */
export const genderOptions = [
  { label: 'Male', value: 'true' },
  { label: 'Female', value: 'false' },
] as const

/**
 * Sort options for staff table
 */
export const sortByOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Full Name', value: 'fullName' },
  { label: 'Email', value: 'email' },
] as const

/**
 * Sort order options
 */
export const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
] as const
