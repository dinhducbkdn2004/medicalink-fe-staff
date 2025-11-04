import { CheckCircle2, XCircle, User, UserX } from 'lucide-react'

/**
 * Doctor status options
 * Matches the Doctors API isActive field
 */
export const statusOptions = [
  {
    label: 'Active',
    value: 'true',
    icon: CheckCircle2,
  },
  {
    label: 'Inactive',
    value: 'false',
    icon: XCircle,
  },
] as const

/**
 * Gender options for doctors
 */
export const genderOptions = [
  { label: 'Male', value: 'true', icon: User },
  { label: 'Female', value: 'false', icon: UserX },
] as const

/**
 * Sort options for doctor table
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
