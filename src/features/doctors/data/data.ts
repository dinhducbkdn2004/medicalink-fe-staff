import { CheckCircle2, XCircle, User, UserX } from 'lucide-react'

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

export const genderOptions = [
  { label: 'Male', value: 'true', icon: User },
  { label: 'Female', value: 'false', icon: UserX },
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
