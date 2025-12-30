import { CheckCircle2, XCircle, User, UserX } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Active',
    value: 'false',
    icon: CheckCircle2,
  },
  {
    label: 'Deleted',
    value: 'true',
    icon: XCircle,
  },
] as const

export const genderOptions = [
  { label: 'Male', value: 'true', icon: User },
  { label: 'Female', value: 'false', icon: UserX },
] as const

export const sortByOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Updated Date', value: 'updatedAt' },
  { label: 'Date of Birth', value: 'dateOfBirth' },
  { label: 'Full Name', value: 'fullName' },
] as const

export const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
] as const
