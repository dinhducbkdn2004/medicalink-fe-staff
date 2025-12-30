import { CheckCircle, XCircle } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Active',
    value: 'true',
    icon: CheckCircle,
  },
  {
    label: 'Inactive',
    value: 'false',
    icon: XCircle,
  },
]

export const sortOptions = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Created Date',
    value: 'createdAt',
  },
  {
    label: 'Updated Date',
    value: 'updatedAt',
  },
]
