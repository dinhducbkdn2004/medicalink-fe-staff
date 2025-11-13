import { CheckCircle2, XCircle, User, UserX } from 'lucide-react'

/**
 * Patient status options (based on deletedAt field)
 */
export const statusOptions = [
  {
    label: 'Active',
    value: 'false', // not deleted
    icon: CheckCircle2,
  },
  {
    label: 'Deleted',
    value: 'true', // deleted
    icon: XCircle,
  },
] as const

/**
 * Gender options for patients
 */
export const genderOptions = [
  { label: 'Male', value: 'true', icon: User },
  { label: 'Female', value: 'false', icon: UserX },
] as const

/**
 * Sort options for patient table
 */
export const sortByOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Updated Date', value: 'updatedAt' },
  { label: 'Date of Birth', value: 'dateOfBirth' },
  { label: 'Full Name', value: 'fullName' },
] as const

/**
 * Sort order options
 */
export const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
] as const
